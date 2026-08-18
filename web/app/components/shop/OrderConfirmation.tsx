"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import useCart, { CartLineItem } from "@/app/hooks/useCart";
import CartProductItem from "./CartProductItem";
import { _localizeText } from "@/app/sanity-api/utils";
import useLocale from "@/app/context/LocaleContext";
import PageHeader from "../PageHeader";

type ShopifyOrderLineItem = {
  id: number;
  variant_id: number | null;
  title: string;
  variant_title?: string | null;
  quantity: number;
  price: string;
};

type ShopifyOrder = {
  id: number;
  name?: string;
  email?: string;
  financial_status?: string;
  created_at?: string;
  total_price?: string;
  subtotal_price?: string;
  total_shipping_price_set?: { shop_money?: { amount?: string } };
  line_items?: ShopifyOrderLineItem[];
  customer?: { first_name?: string; last_name?: string; email?: string } | null;
  shipping_address?: {
    first_name?: string;
    last_name?: string;
    address1?: string;
    address2?: string;
    zip?: string;
    city?: string;
    country?: string;
  } | null;
};

type PageStatus = "success" | "processing" | "failure" | "not-found";

const SUCCESS_FINANCIAL_STATUSES = ["paid", "partially_paid", "authorized"];
const PENDING_FINANCIAL_STATUSES = ["pending"];
const FAILURE_FINANCIAL_STATUSES = [
  "voided",
  "refunded",
  "partially_refunded",
];

const FINANCIAL_STATUS_LABEL_KEYS: Record<string, string> = {
  paid: "orderStatusPaid",
  partially_paid: "orderStatusPartiallyPaid",
  pending: "orderStatusPending",
  authorized: "orderStatusAuthorized",
  refunded: "orderStatusRefunded",
  partially_refunded: "orderStatusPartiallyRefunded",
  voided: "orderStatusVoided",
};

const FAILURE_PARAM_VALUES = new Set([
  "cancel",
  "cancelled",
  "canceled",
  "failure",
  "failed",
  "error",
  "declined",
  "refused",
  "voided",
]);
const SUCCESS_PARAM_VALUES = new Set(["success", "paid", "ok"]);

const TITLE_KEYS: Record<PageStatus, string> = {
  success: "orderSuccessTitle",
  processing: "orderProcessingTitle",
  failure: "orderFailureTitle",
  "not-found": "orderNotFoundTitle",
};
const SUBTITLE_KEYS: Record<PageStatus, string> = {
  success: "orderSuccessSubtitle",
  processing: "orderProcessingSubtitle",
  failure: "orderFailureSubtitle",
  "not-found": "orderNotFoundSubtitle",
};

const OrderConfirmation = () => {
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const { items: cartItems, clearCart } = useCart();

  const orderId =
    searchParams.get("order_id") ||
    searchParams.get("order_number") ||
    searchParams.get("order") ||
    searchParams.get("id");
  const statusParam = (
    searchParams.get("status") ||
    searchParams.get("financial_status") ||
    ""
  ).toLowerCase();

  const [order, setOrder] = useState<ShopifyOrder | null>(null);
  const [orderState, setOrderState] = useState<
    "idle" | "loading" | "loaded" | "not-found" | "error"
  >("idle");

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    setOrderState("loading");
    fetch(`/api/shopify/order/${encodeURIComponent(orderId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ShopifyOrder | null) => {
        if (cancelled) return;
        if (data?.id) {
          setOrder(data);
          setOrderState("loaded");
        } else {
          setOrderState("not-found");
        }
      })
      .catch(() => {
        if (!cancelled) setOrderState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  // Cart items are hydrated from localStorage asynchronously on mount — snapshot
  // them once so the recap survives clearCart() firing later on success.
  const [cartSnapshot, setCartSnapshot] = useState<CartLineItem[]>([]);
  const snapshotTaken = useRef(false);
  useEffect(() => {
    if (!snapshotTaken.current && cartItems.length > 0) {
      snapshotTaken.current = true;
      setCartSnapshot(cartItems);
    }
  }, [cartItems]);

  const pageStatus: PageStatus = useMemo(() => {
    if (FAILURE_PARAM_VALUES.has(statusParam)) return "failure";
    if (order?.financial_status) {
      if (FAILURE_FINANCIAL_STATUSES.includes(order.financial_status))
        return "failure";
      if (PENDING_FINANCIAL_STATUSES.includes(order.financial_status))
        return "processing";
      return "success";
    }
    if (orderId) {
      return orderState === "not-found" || orderState === "error"
        ? "not-found"
        : "processing";
    }
    if (SUCCESS_PARAM_VALUES.has(statusParam)) return "success";
    return cartSnapshot.length > 0 ? "processing" : "not-found";
  }, [statusParam, order, orderId, orderState, cartSnapshot]);

  // TODO: re-enable clearing the cart on success once this template is
  // finished — disabled for now so test carts survive repeated visits.
  const CLEAR_CART_ON_SUCCESS = false;
  const clearedRef = useRef(false);
  useEffect(() => {
    if (!CLEAR_CART_ON_SUCCESS) return;
    if (pageStatus === "success" && !clearedRef.current) {
      clearedRef.current = true;
      clearCart();
    }
  }, [pageStatus, clearCart]);

  const displayItems = useMemo(() => {
    if (order?.line_items?.length) {
      return order.line_items.map((li) => {
        const variantId = li.variant_id != null ? String(li.variant_id) : null;
        const match =
          cartSnapshot.find((c) => c.id === variantId) ||
          cartSnapshot.find((c) => c.title === li.title);
        return {
          id: String(li.id),
          title: li.title,
          variant: li.variant_title || match?.variant,
          artists: match?.artists,
          image: match?.image,
          price: Number(li.price),
          quantity: li.quantity,
        };
      });
    }
    return cartSnapshot;
  }, [order, cartSnapshot]);

  const computedSubtotal = displayItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const subtotal = order?.subtotal_price
    ? Number(order.subtotal_price)
    : computedSubtotal;
  const shippingCost = order?.total_shipping_price_set?.shop_money?.amount
    ? Number(order.total_shipping_price_set.shop_money.amount)
    : null;
  const total = order?.total_price ? Number(order.total_price) : computedSubtotal;

  const customerName = [
    order?.customer?.first_name || order?.shipping_address?.first_name,
    order?.customer?.last_name || order?.shipping_address?.last_name,
  ]
    .filter(Boolean)
    .join(" ");
  const customerEmail = order?.email || order?.customer?.email;
  const address = order?.shipping_address;

  const orderDateLabel = order?.created_at
    ? new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(order.created_at))
    : null;

  const statusLabelKey = order?.financial_status
    ? FINANCIAL_STATUS_LABEL_KEYS[order.financial_status]
    : undefined;

  // _localizeText reads locale via a hook internally, so every key it needs
  // must be called unconditionally, in the same order, on every render —
  // never from inside a conditionally-rendered branch below.
  const tTitle = _localizeText(TITLE_KEYS[pageStatus]);
  const tSubtitle = _localizeText(SUBTITLE_KEYS[pageStatus]);
  const tOrderNumber = _localizeText("orderNumber");
  const tOrderDate = _localizeText("orderDate");
  const tOrderStatus = _localizeText("orderStatus");
  const tStatusValue = _localizeText(statusLabelKey ?? "orderStatus");
  const tClientInfos = _localizeText("clientInfos");
  const tYourOrder = _localizeText("yourOrder");
  const tSubtotal = _localizeText("subtotal");
  const tShippingCost = _localizeText("shippingCost");
  const tTotal = _localizeText("total");
  const tBackLabel = _localizeText(
    pageStatus === "failure" ? "backToShop" : "backHome",
  );

  return (
    <div
      className={clsx("template template--order-confirmation", `is-${pageStatus}`)}
      data-template='order-confirmation'>
      <PageHeader h1={tTitle} subTitle={tSubtitle} />
      <section className='module module--order-confirmation'>
        <div className='container-fluid'>
          <div className='module__inner'>
            <div className='grid md:grid-cols-12 gap-gutter'>
              <div className='md:col-span-3 module__aside'>
                <aside className='sidebar order-recap'>
                  {order?.name && (
                    <div className='sidebar__item'>
                      <h3 className='c-tag underline'>{tOrderNumber}</h3>
                      <p>{order.name}</p>
                    </div>
                  )}
                  {orderDateLabel && (
                    <div className='sidebar__item'>
                      <h3 className='c-tag underline'>{tOrderDate}</h3>
                      <p>{orderDateLabel}</p>
                    </div>
                  )}
                  {statusLabelKey && (
                    <div className='sidebar__item'>
                      <h3 className='c-tag underline'>{tOrderStatus}</h3>
                      <p>{tStatusValue}</p>
                    </div>
                  )}
                  {(customerName || customerEmail || address) && (
                    <div className='sidebar__item'>
                      <h3 className='c-tag underline'>{tClientInfos}</h3>
                      {customerName && <p>{customerName}</p>}
                      {customerEmail && <p>{customerEmail}</p>}
                      {address && (
                        <p>
                          {address.address1}
                          {address.address2 ? `, ${address.address2}` : ""}
                          <br />
                          {[address.zip, address.city]
                            .filter(Boolean)
                            .join(" ")}
                          {address.country ? `, ${address.country}` : ""}
                        </p>
                      )}
                    </div>
                  )}
                </aside>
              </div>

              <div className='module__text md:col-span-7'>
                {displayItems.length > 0 && (
                  <>
                    <h2 className='c-tag underline order-recap__title'>
                      {tYourOrder}
                    </h2>
                    <ul className='cart-modal__list order-recap__list'>
                      {displayItems.map((item) => (
                        <CartProductItem key={item.id} line={item} readOnly />
                      ))}
                    </ul>
                    <div className='cart-modal__footer order-recap__totals'>
                      {shippingCost !== null && (
                        <>
                          <div className='cart-modal__total'>
                            <span>{tSubtotal}</span>
                            <span>{subtotal}€</span>
                          </div>
                          <div className='cart-modal__total'>
                            <span>{tShippingCost}</span>
                            <span>{shippingCost}€</span>
                          </div>
                        </>
                      )}
                      <div className='cart-modal__total order-recap__grand-total'>
                        <span>{tTotal}</span>
                        <span>{total}€</span>
                      </div>
                    </div>
                  </>
                )}
                <Link
                  className='btn order-recap__cta'
                  href={pageStatus === "failure" ? "/librairie" : "/"}>
                  {tBackLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderConfirmation;
