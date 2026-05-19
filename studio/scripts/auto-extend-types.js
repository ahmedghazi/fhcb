#!/usr/bin/env node

/**
 * auto-extend-types.js
 * ====================
 *
 * RÔLE
 * ----
 * Sanity TypeGen génère `sanity.types.ts` à partir du schéma, mais les champs image
 * restent typés avec `SanityImageAssetReference` (juste un `_ref`) et les champs
 * référence restent des `*Reference` non-résolus. Ce script génère
 * `sanity-expanded.types.ts` qui étend ces types pour refléter ce que renvoient
 * réellement les requêtes GROQ une fois les assets et références résolus.
 *
 * Exemple :
 *   `imageCover?: { asset?: SanityImageAssetReference }`
 *   →  `imageCover?: { asset?: SanityImageAssetFull | null } | null`
 *
 *   `coProduction?: Array<KeyVal | PartenaireReference>`
 *   →  `coProduction?: Array<KeyValExpanded | PartenaireExpanded> | null`
 *
 * UTILISATION
 * -----------
 *   npm run typegen          # depuis le dossier studio/
 *   node scripts/auto-extend-types.js   # directement (nécessite sanity.types.ts à jour)
 *
 * Le script est automatiquement enchaîné après `sanity typegen generate` via le
 * script npm `typegen` défini dans studio/package.json.
 *
 * CONFIGURATION
 * -------------
 * Le script lit `studio/scripts/typegen.config.json` s'il existe :
 *
 *   {
 *     "webPath": "../../web",
 *     "sanityApiPath": "app/sanity-api/types",
 *     "generatedTypesFile": "sanity.types.ts",
 *     "extendedTypesFile": "sanity-expanded.types.ts",
 *     "fieldTypeOverrides": {
 *       "Project": {
 *         "contributions": "ContributionExpanded[] | null",
 *         "media": "MediaExpanded | null"
 *       }
 *     }
 *   }
 *
 * Sans ce fichier, la structure du projet est détectée automatiquement en testant
 * plusieurs chemins relatifs standards (../../web, ../web, etc.).
 *
 * `fieldTypeOverrides` permet d'injecter manuellement des types pour des champs
 * dont la forme réelle ne peut pas être inférée automatiquement (ex. unions complexes,
 * types issus de plugins tiers).
 *
 * ALGORITHME
 * ----------
 * 1. Parse `sanity.types.ts` avec du text-scanning (pas d'AST) pour trouver :
 *    - Les types `*Reference` et le document qu'ils pointent
 *    - Les types document (ceux qui ont `_id` et `_createdAt`)
 *    - Les champs image inline (ceux qui contiennent `asset?: SanityImageAssetReference`)
 *
 * 2. Premier pass — types document :
 *    Crée `XxxExpanded` pour chaque type document qui a des champs image ou référence.
 *
 * 3. Second pass — types objet non-document (itératif) :
 *    Détecte les types objet qui contiennent des champs image ou qui référencent en
 *    inline un type déjà étendu (ex. `Array<{ _key: string } & KeyVal>`).
 *    Répète jusqu'à ce qu'aucun nouveau type ne soit trouvé (propagation en profondeur).
 *
 * 4. Tri topologique :
 *    Ordonne les types générés pour que les dépendances apparaissent avant les types
 *    qui les utilisent.
 *
 * 5. Génère le fichier final avec les imports nécessaires et les définitions de types.
 *
 * FICHIER GÉNÉRÉ
 * --------------
 * Ne pas éditer `sanity-expanded.types.ts` manuellement — il est écrasé à chaque
 * `npm run typegen`. Pour des ajustements ponctuels, utiliser `fieldTypeOverrides`
 * dans `typegen.config.json`.
 */

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
    const sanityTypesPath = path.join(webPath, 'app/sanity-api/types/sanity.types.ts')

    if (fs.existsSync(sanityTypesPath)) {
      console.log(`✅ Found structure: web="${structure.web}"`)
      return {
        webRoot: webPath,
        sanityTypesPath,
        extendedTypesPath: path.join(webPath, 'app/sanity-api/types/sanity-extend.types.ts'),
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

function isDocumentTypeBlock(block) {
  return block.includes('_id: string') && block.includes('_createdAt: string')
}

// Keeps only depth-0 characters (outside all `{}` blocks).
// Used to detect type names that appear directly in a field, not inside an inline object literal.
function stripNestedBraces(str) {
  let result = ''
  let depth = 0
  for (const ch of str) {
    if (ch === '{') depth++
    else if (ch === '}') depth--
    else if (depth === 0) result += ch
  }
  return result
}

// Returns the leading field name, or null if the field is internal (`_`-prefixed).
function getFieldName(field) {
  const m = field.match(/^\s*(\w+)\??:/)
  return m && !m[1].startsWith('_') ? m[1] : null
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
 * Results are cached since content is immutable within a single run.
 */
const _typeBlockCache = new Map()

function extractObjectTypeBlock(content, typeName) {
  if (_typeBlockCache.has(typeName)) return _typeBlockCache.get(typeName)

  const startPattern = new RegExp(`export type ${typeName}\\s*=\\s*\\{`)
  const match = startPattern.exec(content)
  if (!match) {
    _typeBlockCache.set(typeName, null)
    return null
  }

  let depth = 0
  let i = match.index + match[0].length - 1

  for (; i < content.length; i++) {
    if (content[i] === '{') depth++
    else if (content[i] === '}') {
      depth--
      if (depth === 0) {
        const result = content.slice(match.index, i + 1)
        _typeBlockCache.set(typeName, result)
        return result
      }
    }
  }
  _typeBlockCache.set(typeName, null)
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
    if (block && isDocumentTypeBlock(block)) names.push(name)
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
 *
 * Example:
 *   "client?: ClientReference"                        → true  for ClientReference
 *   "location?: Array<{ _key: string } & LocRef>"    → true  for LocRef (outside braces)
 *   "contributions?: Array<{ service?: SvcRef; … }>" → false for SvcRef (inside braces)
 */
function containsDirectReference(fieldText, refTypeName) {
  return stripNestedBraces(fieldText).includes(refTypeName)
}

/**
 * For a type block, return names of top-level fields that are inline image objects
 * (i.e. contain `asset?: SanityImageAssetReference` at their first level).
 */
function findImageFields(typeBlock) {
  const result = []

  for (const field of extractTopLevelFields(typeBlock)) {
    const fieldName = getFieldName(field)
    if (!fieldName) continue

    // Collect depth-1 characters (inside the outermost `{}`) to inspect the first object level only.
    let firstLevel = ''
    let depth = 0
    for (const ch of field) {
      if (ch === '{') depth++
      else if (ch === '}') depth--
      else if (depth === 1) firstLevel += ch
    }
    if (!firstLevel.includes('asset?: SanityImageAssetReference')) continue

    result.push(fieldName)
  }

  return result
}

/**
 * For a document type block, return all fields that contain a direct reference type.
 * Each result: { fieldName, targetTypeName, isArray }
 */
function findReferenceFields(typeBlock, referenceTypes) {
  const result = []

  for (const field of extractTopLevelFields(typeBlock)) {
    const fieldName = getFieldName(field)
    if (!fieldName) continue

    for (const [refTypeName, targetTypeName] of Object.entries(referenceTypes)) {
      if (!containsDirectReference(field, refTypeName)) continue
      const isArray = /Array\s*</.test(field)
      result.push({fieldName, targetTypeName, isArray})
      break
    }
  }

  return result
}

/**
 * For a type block, find fields whose type string directly references a type name
 * that has an expanded version. Catches inline intersections like
 * `Array<{ _key: string } & ImageInGrid>` where `ImageInGrid` → `ImageInGridExpanded`.
 *
 * @param {Map<string, RegExp>} expandedPatterns - pre-compiled word-boundary patterns per type name
 */
function findInlineTypeRefs(typeBlock, expandedPatterns) {
  const result = []

  for (const field of extractTopLevelFields(typeBlock)) {
    const fieldName = getFieldName(field)
    if (!fieldName) continue

    for (const [typeName, pattern] of expandedPatterns) {
      if (pattern.test(field)) {
        const typeStr = field.replace(/^\s*\w+\??\s*:\s*/, '').trim()
        result.push({fieldName, typeName, typeStr})
        break
      }
    }
  }

  return result
}

// ─── Topological sort ────────────────────────────────────────────────────────

/**
 * Sort expanded types so that dependencies come before dependents.
 * Considers both reference fields and inline type refs.
 */
function topoSort(expandedMap) {
  const expandedTypeNames = new Set(expandedMap.keys())
  const visited = new Set()
  const sorted = []

  function visit(typeName) {
    if (visited.has(typeName)) return
    visited.add(typeName)
    const {refFields, inlineRefFields} = expandedMap.get(typeName)
    for (const f of refFields) {
      if (expandedTypeNames.has(f.targetTypeName)) visit(f.targetTypeName)
    }
    for (const f of inlineRefFields) {
      if (expandedTypeNames.has(f.typeName)) visit(f.typeName)
    }
    sorted.push(typeName)
  }

  for (const typeName of expandedMap.keys()) visit(typeName)

  return sorted
}

// ─── Code generation ──────────────────────────────────────────────────────────

/**
 * Generate the `XxxExpanded` type for one document or object type.
 *
 * - Reference fields pointing to a type that itself has an Expanded variant
 *   automatically use `TargetTypeExpanded` instead of `TargetType`.
 * - Inline ref fields (e.g. `Array<{ _key: string } & ImageInGrid>`) have
 *   `TypeName` replaced with `TypeNameExpanded` in the type string.
 * - Image asset fields use `SanityImageAssetFull` (which adds `creditLine`
 *   and other standard fields that TypeGen may omit).
 * - Extra fields from `fieldTypeOverrides[typeName]` are appended.
 *
 * @param {object} ctx
 * @param {string} ctx.typeName
 * @param {Array} ctx.refFields
 * @param {string[]} ctx.imageFields
 * @param {Array} ctx.inlineRefFields
 * @param {Set<string>} ctx.expandedTypeNames
 * @param {object} ctx.fieldTypeOverrides
 * @param {Array<{pattern: RegExp, replacement: string}>} ctx.refTypeReplacements
 */
function generateExpandedType({typeName, refFields, imageFields, inlineRefFields, expandedTypeNames, fieldTypeOverrides, refTypeReplacements}) {
  const overrides = fieldTypeOverrides[typeName] || {}
  const overrideFieldNames = Object.keys(overrides)

  const omitSet = new Set([
    ...refFields.map((f) => f.fieldName),
    ...imageFields,
    ...inlineRefFields.map((f) => f.fieldName),
    ...overrideFieldNames,
  ])
  const omitKeys = [...omitSet].map((k) => `'${k}'`).join(' | ')

  // Use TargetTypeExpanded when the target itself has an expanded version
  const refFieldLines = refFields.map((f) => {
    const targetName = expandedTypeNames.has(f.targetTypeName)
      ? `${f.targetTypeName}Expanded`
      : f.targetTypeName
    const resolvedType = f.isArray ? `Array<${targetName}>` : targetName
    return `  ${f.fieldName}?: ${resolvedType} | null`
  })

  // Expand asset → SanityImageAssetFull (adds creditLine + other built-in fields TypeGen omits)
  const imageFieldLines = imageFields.map((fieldName) =>
    `  ${fieldName}?: (Omit<NonNullable<NonNullable<${typeName}>['${fieldName}']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null`
  )

  // Replace TypeName → TypeNameExpanded, and *Reference → *TargetExpanded for dereferenced arrays
  const inlineRefFieldLines = inlineRefFields.map(({fieldName, typeName: refTypeName, typeStr}) => {
    let expandedTypeStr = typeStr.replace(
      new RegExp(`\\b${refTypeName}\\b`, 'g'),
      `${refTypeName}Expanded`,
    )
    for (const {pattern, replacement} of refTypeReplacements) {
      expandedTypeStr = expandedTypeStr.replace(pattern, replacement)
    }
    return `  ${fieldName}?: ${expandedTypeStr} | null`
  })

  const overrideLines = overrideFieldNames.map((fieldName) =>
    `  ${fieldName}?: ${overrides[fieldName]}`
  )

  const expandedFields = [...refFieldLines, ...imageFieldLines, ...inlineRefFieldLines, ...overrideLines].join(';\n')

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

  // First pass: document types with reference or image fields
  const expandedMap = new Map()
  for (const typeName of documentTypeNames) {
    const typeBlock = extractObjectTypeBlock(content, typeName)
    if (!typeBlock) continue
    const refFields = findReferenceFields(typeBlock, referenceTypes)
    const imageFields = findImageFields(typeBlock)
    if (refFields.length > 0 || imageFields.length > 0) {
      expandedMap.set(typeName, {refFields, imageFields, inlineRefFields: []})
    }
  }

  for (const typeName of Object.keys(meta.fieldTypeOverrides)) {
    if (!expandedMap.has(typeName)) {
      expandedMap.set(typeName, {refFields: [], imageFields: [], inlineRefFields: []})
    }
  }

  if (expandedMap.size === 0) {
    throw new Error('No document types with reference or image fields found. Nothing to generate.')
  }

  // Second pass: non-document object types with image fields or inline refs to already-expanded types.
  // Candidate blocks are built once to avoid re-scanning the full file on each iteration.
  const candidateBlocks = new Map()
  {
    const objPattern = /export type (\w+)\s*=\s*\{/g
    let m
    while ((m = objPattern.exec(content)) !== null) {
      const typeName = m[1]
      if (expandedMap.has(typeName)) continue
      const typeBlock = extractObjectTypeBlock(content, typeName)
      if (!typeBlock || isDocumentTypeBlock(typeBlock)) continue
      candidateBlocks.set(typeName, typeBlock)
    }
  }

  // Patterns are compiled incrementally as new types are promoted to expandedMap.
  const compiledPatterns = new Map()

  let moreFound = true
  while (moreFound) {
    moreFound = false
    for (const name of expandedMap.keys()) {
      if (!compiledPatterns.has(name)) compiledPatterns.set(name, new RegExp(`\\b${name}\\b`))
    }
    for (const [typeName, typeBlock] of candidateBlocks) {
      if (expandedMap.has(typeName)) {
        candidateBlocks.delete(typeName)
        continue
      }
      const imageFields = findImageFields(typeBlock)
      const inlineRefFields = findInlineTypeRefs(typeBlock, compiledPatterns)
      if (imageFields.length > 0 || inlineRefFields.length > 0) {
        expandedMap.set(typeName, {refFields: [], imageFields, inlineRefFields})
        moreFound = true
      }
    }
  }

  const expandedTypeNames = new Set(expandedMap.keys())
  const sortedTypeNames = topoSort(expandedMap)

  // Pre-filter to reference types whose target has an expanded version, and pre-compile patterns.
  // These are used when expanding mixed arrays like Array<KeyVal | PartenaireReference> where
  // the GROQ query uses []-> to dereference references into their full document shape.
  const refTypeReplacements = Object.entries(referenceTypes)
    .filter(([, targetType]) => expandedTypeNames.has(targetType))
    .map(([refType, targetType]) => ({
      pattern: new RegExp(`\\b${refType}\\b`, 'g'),
      replacement: `${targetType}Expanded`,
    }))

  const neededImports = new Set()
  let hasImageFields = false
  for (const [typeName, {refFields, imageFields}] of expandedMap) {
    neededImports.add(typeName)
    for (const f of refFields) neededImports.add(f.targetTypeName)
    if (imageFields.length > 0) hasImageFields = true
  }
  if (hasImageFields) neededImports.add('SanityImageAsset')

  console.log('🔎 Scanning for reference and image fields...')
  for (const typeName of sortedTypeNames) {
    const {refFields, imageFields, inlineRefFields} = expandedMap.get(typeName)
    const overrideFields = Object.keys(meta.fieldTypeOverrides[typeName] || {})
    const allFields = [
      ...refFields.map((f) => (f.isArray ? `${f.fieldName}[]` : f.fieldName)),
      ...imageFields.map((f) => `${f} (image)`),
      ...inlineRefFields.map((f) => `${f.fieldName} (inline-ref)`),
      ...overrideFields.map((f) => `${f} (override)`),
    ]
    console.log(`  ✓ ${typeName}Expanded  [${allFields.join(', ')}]`)
  }

  const typeDefs = sortedTypeNames
    .map((typeName) => {
      const {refFields, imageFields, inlineRefFields} = expandedMap.get(typeName)
      return generateExpandedType({
        typeName,
        refFields,
        imageFields,
        inlineRefFields,
        expandedTypeNames,
        fieldTypeOverrides: meta.fieldTypeOverrides,
        refTypeReplacements,
      })
    })
    .join('\n\n')

  const importLine = `import type {\n  ${[...neededImports].join(',\n  ')}\n} from './sanity.types'`

  const sanityImageAssetFull = hasImageFields
    ? `export type SanityImageAssetFull = SanityImageAsset & {\n  creditLine?: string;\n};\n`
    : ''

  return (
    `// AUTO-GENERATED EXTENDED TYPES - DO NOT EDIT MANUALLY\n` +
    `// Generated on: ${meta.date}\n` +
    `// Run 'npm run typegen' to regenerate\n` +
    `// Project structure: web="${meta.web}", studio="${meta.studio}"\n` +
    `// Detection method: ${meta.fromConfig ? 'configuration file' : 'auto-detection'}\n` +
    `\n` +
    `${importLine}\n` +
    `\n` +
    `${sanityImageAssetFull}` +
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
  console.log('   2. Check that your web folder contains: app/sanity-api/types/sanity.types.ts')
  console.log('   3. Create a typegen.config.json file in the scripts folder for custom paths')
  console.log('   4. Verify your project structure matches one of the supported patterns:')
  console.log('      - studio/scripts -> web (../../web)')
  console.log('      - scripts -> web (../web)')
  console.log('      - nested studio (../../../web)')
  console.log('      - root level (./web)')
  process.exit(1)
}
