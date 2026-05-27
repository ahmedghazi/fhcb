// "use client";
// import { useCart } from "@/app/hooks/useCart";
// import { useSearchParams } from "next/navigation";
// import { useEffect } from "react";
// // import { useCart } from "@/hooks/useCart";

// export default function ConfirmationPage() {
//   const params = useSearchParams();
//   const { clearCart } = useCart();
//   const isPaid = params.get("financial_status") === "paid";
//   const orderId = params.get("order_id");

//   useEffect(() => {
//     if (isPaid) clearCart();
//   }, [isPaid]);

//   // ...
// }
import React from "react";

type Props = {};

const page = (props: Props) => {
  return <div>page</div>;
};

export default page;
