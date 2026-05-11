#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// ─── Config & path detection ──────────────────────────────────────────────────

function loadConfig() {
  const configPath = path.join(__dirname, 'typegen.config.json')
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
      console.log('📋 Using configuration from typegen.config.json')
      return config
    } catch (error) {
      console.warn('⚠️  Warning: Could not parse typegen.config.json, using auto-detection')
    }
  }
  return null
}

function findProjectStructure() {
  const currentDir = __dirname
  const config = loadConfig()

  if (config) {
    const webPath = path.resolve(currentDir, config.webPath)
    const sanityTypesPath = path.join(webPath, config.sanityApiPath, config.generatedTypesFile)

    if (fs.existsSync(sanityTypesPath)) {
      return {
        webRoot: webPath,
        sanityTypesPath,
        extendedTypesPath: path.join(webPath, config.sanityApiPath, config.extendedTypesFile),
        structure: {web: config.webPath, studio: './'},
        fieldTypeOverrides: config.fieldTypeOverrides || {},
        fromConfig: true,
      }
    } else {
      console.warn('⚠️  Configured path not found, falling back to auto-detection')
    }
  }

  const possibleStructures = [
    {web: '../../web', studio: '../'},
    {web: '../web', studio: '../'},
    {web: '../../../web', studio: '../../'},
    {web: './web', studio: './studio'},
    {web: '../frontend', studio: '../'},
    {web: '../../frontend', studio: '../'},
  ]

  console.log('🔍 Auto-detecting project structure...')

  for (const structure of possibleStructures) {
    const webPath = path.resolve(currentDir, structure.web)
    const sanityTypesPath = path.join(webPath, 'app/utils/sanity-api/sanity.types.ts')

    if (fs.existsSync(sanityTypesPath)) {
      console.log(`✅ Found structure: web="${structure.web}"`)
      return {
        webRoot: webPath,
        sanityTypesPath,
        extendedTypesPath: path.join(webPath, 'app/utils/sanity-api/sanity-extend.types.ts'),
        structure,
        fieldTypeOverrides: {},
        fromConfig: false,
      }
    }
  }

  throw new Error(
    'Could not find web folder with sanity.types.ts. Please check your project structure or create a typegen.config.json file.',
  )
}

// ─── Parser ───────────────────────────────────────────────────────────────────

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Find all `*Reference` types and the document type they point to.
 * Returns e.g. { "ClientReference": "Client", "PersonReference": "Person" }
 */
function findReferenceTypes(content) {
  const refs = {}
  const pattern =
    /export type (\w+Reference) = \{[^[]*\[internalGroqTypeReferenceTo\]\?:\s*['"](\w+)['"]/g
  let m
  while ((m = pattern.exec(content)) !== null) {
    refs[m[1]] = capitalize(m[2])
  }
  return refs
}

/**
 * Extract the full `export type Name = { ... }` block using brace counting.
 * Returns null if the type is not an object type (e.g. union or array).
 */
function extractObjectTypeBlock(content, typeName) {
  const startPattern = new RegExp(`export type ${typeName}\\s*=\\s*\\{`)
  const match = startPattern.exec(content)
  if (!match) return null

  let depth = 0
  let i = match.index + match[0].length - 1

  for (; i < content.length; i++) {
    if (content[i] === '{') depth++
    else if (content[i] === '}') {
      depth--
      if (depth === 0) return content.slice(match.index, i + 1)
    }
  }
  return null
}

/**
 * Return names of all document types (those with `_id: string` and `_createdAt: string`).
 */
function findDocumentTypeNames(content) {
  const names = []
  const pattern = /export type (\w+) = \{/g
  let m
  while ((m = pattern.exec(content)) !== null) {
    const name = m[1]
    const block = extractObjectTypeBlock(content, name)
    if (block && block.includes('_id: string') && block.includes('_createdAt: string')) {
      names.push(name)
    }
  }
  return names
}

/**
 * Split a type block into its top-level field definition strings.
 */
function extractTopLevelFields(typeBlock) {
  const startIdx = typeBlock.indexOf('{')
  if (startIdx === -1) return []

  let depth = 0
  let endIdx = -1
  for (let i = startIdx; i < typeBlock.length; i++) {
    if (typeBlock[i] === '{') depth++
    else if (typeBlock[i] === '}') {
      depth--
      if (depth === 0) {
        endIdx = i
        break
      }
    }
  }
  if (endIdx === -1) return []

  const inner = typeBlock.slice(startIdx + 1, endIdx)
  const fields = []
  let braceDepth = 0
  let angleDepth = 0
  let current = ''

  for (const ch of inner) {
    if (ch === '{') braceDepth++
    else if (ch === '}') braceDepth--
    else if (ch === '<') angleDepth++
    else if (ch === '>') angleDepth--

    if (braceDepth === 0 && angleDepth === 0 && (ch === ';' || ch === '\n')) {
      const field = current.trim()
      if (field) fields.push(field)
      current = ''
    } else {
      current += ch
    }
  }

  return fields
}

/**
 * Check whether `refTypeName` appears in `fieldText` outside of any `{ }` block.
 * This prevents matching references nested inside inline object types.
 *
 * Example:
 *   "client?: ClientReference"                        → true  for ClientReference
 *   "location?: Array<{ _key: string } & LocRef>"    → true  for LocRef (outside braces)
 *   "contributions?: Array<{ service?: SvcRef; … }>" → false for SvcRef (inside braces)
 */
function containsDirectReference(fieldText, refTypeName) {
  let stripped = ''
  let depth = 0
  for (const ch of fieldText) {
    if (ch === '{') depth++
    else if (ch === '}') depth--
    else if (depth === 0) stripped += ch
  }
  return stripped.includes(refTypeName)
}

/**
 * For a document type block, return all fields that contain a direct reference type.
 * Each result: { fieldName, targetTypeName, isArray }
 */
function findReferenceFields(typeBlock, referenceTypes) {
  const fields = extractTopLevelFields(typeBlock)
  const result = []

  for (const field of fields) {
    for (const [refTypeName, targetTypeName] of Object.entries(referenceTypes)) {
      if (!containsDirectReference(field, refTypeName)) continue

      const nameMatch = field.match(/^\s*(\w+)\??:/)
      if (!nameMatch) continue
      const fieldName = nameMatch[1]
      if (fieldName.startsWith('_')) continue

      const isArray = /Array\s*</.test(field)
      result.push({fieldName, targetTypeName, isArray})
      break
    }
  }

  return result
}

// ─── Topological sort ────────────────────────────────────────────────────────

/**
 * Sort expanded types so that dependencies come before dependents.
 * e.g. ContributionExpanded before ProjectExpanded (since Project.contributions → Contribution)
 */
function topoSort(expandedMap) {
  const expandedTypeNames = new Set(expandedMap.keys())
  const visited = new Set()
  const sorted = []

  function visit(typeName) {
    if (visited.has(typeName)) return
    visited.add(typeName)
    const refFields = expandedMap.get(typeName) || []
    for (const f of refFields) {
      if (expandedTypeNames.has(f.targetTypeName)) {
        visit(f.targetTypeName)
      }
    }
    sorted.push(typeName)
  }

  for (const typeName of expandedMap.keys()) {
    visit(typeName)
  }

  return sorted
}

// ─── Code generation ──────────────────────────────────────────────────────────

/**
 * Generate the `XxxExpanded` type for one document type.
 *
 * - Reference fields pointing to a type that itself has an Expanded variant
 *   automatically use `TargetTypeExpanded` instead of `TargetType`.
 * - Extra fields from `fieldTypeOverrides[typeName]` are appended and
 *   their field names are added to the Omit list.
 */
function generateExpandedType(typeName, refFields, expandedTypeNames, fieldTypeOverrides) {
  const overrides = fieldTypeOverrides[typeName] || {}
  const overrideFieldNames = Object.keys(overrides)

  // Omit both ref fields and overridden fields (deduplicated)
  const omitSet = new Set([
    ...refFields.map((f) => f.fieldName),
    ...overrideFieldNames,
  ])
  const omitKeys = [...omitSet].map((k) => `'${k}'`).join(' | ')

  // Ref fields: use TargetTypeExpanded when available
  const refFieldLines = refFields.map((f) => {
    const targetName = expandedTypeNames.has(f.targetTypeName)
      ? `${f.targetTypeName}Expanded`
      : f.targetTypeName
    const resolvedType = f.isArray ? `Array<${targetName}>` : targetName
    return `  ${f.fieldName}?: ${resolvedType} | null`
  })

  // Override fields (project-specific, from typegen.config.json)
  const overrideLines = overrideFieldNames.map((fieldName) => {
    return `  ${fieldName}?: ${overrides[fieldName]}`
  })

  const expandedFields = [...refFieldLines, ...overrideLines].join(';\n')

  return (
    `export type ${typeName}Expanded = Omit<${typeName}, ${omitKeys}> & {\n` +
    `${expandedFields};\n` +
    `};`
  )
}

/**
 * Parse `sanity.types.ts`, find all document types with reference fields,
 * and return the generated file content.
 */
function generateExtendedTypes(content, meta) {
  const referenceTypes = findReferenceTypes(content)

  if (Object.keys(referenceTypes).length === 0) {
    console.warn('⚠️  No reference types found in sanity.types.ts')
  }

  const documentTypeNames = findDocumentTypeNames(content)

  // Build map: typeName → refFields (only types that have reference fields)
  const expandedMap = new Map()
  for (const typeName of documentTypeNames) {
    const typeBlock = extractObjectTypeBlock(content, typeName)
    if (!typeBlock) continue
    const refFields = findReferenceFields(typeBlock, referenceTypes)
    if (refFields.length > 0) {
      expandedMap.set(typeName, refFields)
    }
  }

  // Also include types referenced in fieldTypeOverrides that might not have ref fields
  for (const typeName of Object.keys(meta.fieldTypeOverrides)) {
    if (!expandedMap.has(typeName)) {
      expandedMap.set(typeName, [])
    }
  }

  if (expandedMap.size === 0) {
    throw new Error('No document types with reference fields found. Nothing to generate.')
  }

  const expandedTypeNames = new Set(expandedMap.keys())

  // Sort by dependency order
  const sortedTypeNames = topoSort(expandedMap)

  // Collect needed imports
  const neededImports = new Set()
  for (const [typeName, refFields] of expandedMap) {
    neededImports.add(typeName)
    for (const f of refFields) neededImports.add(f.targetTypeName)
  }

  // Log
  console.log('🔎 Scanning for reference fields...')
  for (const typeName of sortedTypeNames) {
    const refFields = expandedMap.get(typeName)
    const overrideFields = Object.keys(meta.fieldTypeOverrides[typeName] || {})
    const allFields = [
      ...refFields.map((f) => (f.isArray ? `${f.fieldName}[]` : f.fieldName)),
      ...overrideFields.map((f) => `${f} (override)`),
    ]
    console.log(`  ✓ ${typeName}Expanded  [${allFields.join(', ')}]`)
  }

  // Generate type definitions
  const typeDefs = sortedTypeNames
    .map((typeName) =>
      generateExpandedType(
        typeName,
        expandedMap.get(typeName),
        expandedTypeNames,
        meta.fieldTypeOverrides,
      ),
    )
    .join('\n\n')

  const importLine = `import type {\n  ${[...neededImports].join(',\n  ')}\n} from './sanity.types'`

  return (
    `// AUTO-GENERATED EXTENDED TYPES - DO NOT EDIT MANUALLY\n` +
    `// Generated on: ${meta.date}\n` +
    `// Run 'npm run typegen' to regenerate\n` +
    `// Project structure: web="${meta.web}", studio="${meta.studio}"\n` +
    `// Detection method: ${meta.fromConfig ? 'configuration file' : 'auto-detection'}\n` +
    `\n` +
    `${importLine}\n` +
    `\n` +
    `${typeDefs}\n`
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

try {
  const {webRoot, sanityTypesPath, extendedTypesPath, structure, fieldTypeOverrides, fromConfig} =
    findProjectStructure()

  console.log(`📂 Web folder: ${webRoot}`)
  console.log(`📁 Studio folder: ${path.resolve(__dirname, structure.studio)}`)
  console.log(fromConfig ? '⚙️  Using configuration file' : '🔍 Using auto-detection')

  if (!fs.existsSync(sanityTypesPath)) {
    throw new Error(
      `Generated types not found at: ${sanityTypesPath}. Please run 'sanity typegen generate' first.`,
    )
  }

  const content = fs.readFileSync(sanityTypesPath, 'utf8')

  const extendedTypes = generateExtendedTypes(content, {
    date: new Date().toISOString(),
    web: structure.web,
    studio: structure.studio,
    fromConfig,
    fieldTypeOverrides,
  })

  fs.writeFileSync(extendedTypesPath, extendedTypes)

  console.log('✅ Extended types generated successfully!')
  console.log(`📁 Generated: ${extendedTypesPath}`)
} catch (error) {
  console.error('❌ Error generating extended types:', error.message)
  console.log('\n💡 Troubleshooting:')
  console.log('   1. Make sure you have run: sanity typegen generate')
  console.log('   2. Check that your web folder contains: app/utils/sanity-api/sanity.types.ts')
  console.log('   3. Create a typegen.config.json file in the scripts folder for custom paths')
  console.log('   4. Verify your project structure matches one of the supported patterns:')
  console.log('      - studio/scripts -> web (../../web)')
  console.log('      - scripts -> web (../web)')
  console.log('      - nested studio (../../../web)')
  console.log('      - root level (./web)')
  process.exit(1)
}
