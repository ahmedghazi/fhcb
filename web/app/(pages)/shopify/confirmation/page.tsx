import { Suspense } from "react";
import OrderConfirmation from "@/app/components/shop/OrderConfirmation";

export default function ConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmation />
    </Suspense>
  );
}
