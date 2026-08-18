"use client";
import React from "react";
import clsx from "clsx";
import useCart from "../../context/CartContext";
import { _localizeText } from "../../sanity-api/utils";
import Icon from "../ui/Icon";
import CartProductItem from "./CartProductItem";
import { useRouter } from "next/navigation";

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;

const CartModal = () => {
  const router = useRouter();
  const { items, isOpen, closeCart, cartTotal } = useCart();

  const handleCheckout = () => {
    // http://localhost:3000/shopify/confirmation?status=success
    router.push("http://localhost:3000/shopify/confirmation?status=success");
    return;

    if (!items.length || !SHOPIFY_DOMAIN) return;
    const cartPath = items
      .map((line) => `${line.id}:${line.quantity}`)
      .join(",");
    window.location.href = `${SHOPIFY_DOMAIN}/cart/${cartPath}`;
  };

  const tCartEmpty = _localizeText("cartEmpty");
  const tTotal = _localizeText("total");
  const tCheckout = _localizeText("checkout");

  return (
    <div
      className={clsx("cart-modal c-body-xs", isOpen && "is-open")}
      data-lenis-prevent>
      <div className='cart-modal__overlay' onClick={closeCart} />
      <div className='cart-modal__inner'>
        <button
          className='cart-modal__close'
          onClick={closeCart}
          aria-label={_localizeText("close")}>
          <Icon name='close' />
        </button>
        {/* <div className='cart-modal__header'>
          <h2 className='c-h4'>{_localizeText("cart")}</h2>
          <button
            className='cart-modal__close'
            onClick={closeCart}
            aria-label={_localizeText("close")}>
            ×
          </button>
        </div> */}

        {items.length === 0 ? (
          <div className='cart-modal__empty'>
            <p className=''>{tCartEmpty}</p>
          </div>
        ) : (
          <ul className='cart-modal__list'>
            {items.map((line) => (
              <CartProductItem key={line.id} line={line} />
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <div className='cart-modal__footer'>
            <div className='cart-modal__total'>
              <span>{tTotal}</span>
              <span>{cartTotal}€</span>
            </div>
            <button
              className='btn cart-modal__checkout'
              onClick={handleCheckout}>
              {tCheckout}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
