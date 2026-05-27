// import { useState, useCallback } from "react";
// import Cookies from "js-cookie";

// export function useCart() {
//   const [lines, setLines] = useState<CartLineItem[]>([]);
//   const [loading, setLoading] = useState(false);

//   async function storefrontFetch(query: string, variables = {}) {
//     const res = await fetch(
//       `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2024-01/graphql.json`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Shopify-Storefront-Access-Token":
//             process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
//         },
//         body: JSON.stringify({ query, variables }),
//       },
//     );
//     return res.json();
//   }

//   const addToCart = useCallback(async (variantId: string, quantity = 1) => {
//     setLoading(true);
//     try {
//       const cartId = Cookies.get("shopify_cart_id");
//       if (!cartId) {
//         const { data } = await storefrontFetch(CART_CREATE, {
//           lines: [{ merchandiseId: variantId, quantity }],
//         });
//         Cookies.set("shopify_cart_id", data.cartCreate.cart.id, { expires: 7 });
//         setLines(normalizeLines(data.cartCreate.cart.lines.edges));
//       } else {
//         // ... cartLinesAdd
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   return { lines, loading, addToCart /* ... */ };
// }
