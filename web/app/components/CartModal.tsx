"use client";
import React from "react";
import clsx from "clsx";
import Image from "next/image";
import useCart from "../context/CartContext";
import { _localizeText } from "../sanity-api/utils";

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;

const CartProductItem = ({ line }: { line: any }) => {
  const { removeFromCart, updateQuantity } = useCart();
  return (
    <div className='cart-modal__item'>
      {line.image && (
        <div className='cart-modal__image'>
          <Image src={line.image} alt={line.title} width={80} height={80} />
        </div>
      )}
      <div className='cart-modal__infos'>
        <div className='cart-modal__item__header'>
          <div className='suptitle'>suptitle</div>
          <div className='cart-modal__title'>{line.title}</div>
        </div>
        <div className='cart-modal__item__footer'>
          <div className='cart-modal__price'>{line.price}€</div>
          <div className='flex gap-md '>
            <button
              className='cart-modal__delete c-tag'
              onClick={() => removeFromCart(line.id)}>
              {_localizeText("delete")}
            </button>
            <div className='cart-modal__qty c-tag'>
              <button
                onClick={() => updateQuantity(line.id, line.quantity - 1)}
                disabled={line.quantity <= 1}>
                -
              </button>
              <span>{line.quantity}</span>
              <button
                onClick={() => updateQuantity(line.id, line.quantity + 1)}>
                +
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <button
        className='cart-modal__remove'
        onClick={() => removeFromCart(line.id)}
        aria-label={_localizeText("remove")}>
        ×
      </button> */}
    </div>
  );
};
const CartModal = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  const handleCheckout = () => {
    if (!items.length || !SHOPIFY_DOMAIN) return;
    const cartPath = items
      .map((line) => `${line.id}:${line.quantity}`)
      .join(",");
    window.location.href = `${SHOPIFY_DOMAIN}/cart/${cartPath}`;
  };

  return (
    <div
      className={clsx("cart-modal c-body-xs", isOpen && "is-open")}
      data-lenis-prevent>
      <div className='cart-modal__overlay' onClick={closeCart} />
      <div className='cart-modal__inner'>
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
            <p className=''>{_localizeText("cartEmpty")}</p>
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
              <span>{_localizeText("total")}</span>
              <span>{cartTotal}€</span>
            </div>
            <button
              className='btn cart-modal__checkout'
              onClick={handleCheckout}>
              {_localizeText("checkout")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
