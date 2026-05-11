#sh setup-wp.sh
#!/bin/bash

SITE_BASE_DIR="./"
BOILERPLATE_DIR="/Users/ahmedghazi/Sites/_misc/boilerplate-sanity-nextjs"

echo "-- Setup studio"
mkdir studio
cd studio
nvm use 20
echo -n "Please enter your project ID: "
read PROJECT_ID
npm create sanity@latest -- --project $PROJECT_ID --dataset production --template clean
echo "Success Setup studio !!!"

echo "-- Install deps"

yarn add react-icons react-player sanity-codegen sanity-plugin-media sanity-plugin-iframe-pane
echo "Success Install deps !!!"

echo "-- Copy Studio Boilerplate, schema, src"
cp -a  "$BOILERPLATE_DIR/sanity-boilerplate-portfolio-multilangue-base" "$SITE_BASE_DIR/studio"
echo "Success Copy Studio Boilerplate !!!"
cd ..

# echo "-- Setup nextjs"
# npx create-next-app@latest web --typescript --tailwind --eslint --app --no-src-dir --import-alias="@/*"
# echo "Success Setup nextjs !!!"

# echo "-- Install deps"
# cd web
# yarn add @portabletext/react clsx framer-motion gsap next-sanity throttle-debounce @sanity/image-url sass pubsub-js sanity-codegen react-player next-view-transitions cookies-next clsx sass styled-components next-sanity react-intersection-observer
# yarn add -D @types/jsonp @types/pubsub-js @types/styled-components @types/throttle-debounce sanity-codegen postcss
# echo "Success Install deps !!!"

# echo "-- Copy Web Boilerplate"
# cp -a  "$BOILERPLATE_DIR/nextjs-boilerplate/." "$SITE_BASE_DIR/web/"

# echo "-- ADD BLANK ENV FILE"
# echo "
# NEXT_PUBLIC_SANITY_PROJECT_ID=o3ksp2uj
# NEXT_PUBLIC_SANITY_DATASET=production
# SANITY_API_READ_TOKEN=
# " >"$SITE_BASE_DIR/web/.env.local"
# echo "Success ADD BLANK ENV FILE !!!"

open "$SITE_BASE_DIR/"

echo "All done !!!"
