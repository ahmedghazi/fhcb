import React from "react";
import Image from "next/image";
import useCart from "../../context/CartContext";
import { _localizeText } from "../../sanity-api/utils";
import CartQtyStepper from "./CartQtyStepper";

const CartProductItem = ({
  line,
  readOnly = false,
}: {
  line: any;
  readOnly?: boolean;
}) => {
  const { removeFromCart, updateQuantity } = useCart();
  const tDelete = _localizeText("delete");
  return (
    <div className='cart-modal__item'>
      {line.image && (
        <div className='cart-modal__image'>
          <Image src={line.image} alt={line.title} width={80} height={80} />
        </div>
      )}
      <div className='cart-modal__infos'>
        <div className='cart-modal__item__header'>
          <div className='cart-modal__title'>{line.title}</div>
          {line.artists && <div className='suptitle'>{line.artists}</div>}
          {line.variant && <div className='suptitle'>{line.variant}</div>}
        </div>
        <div className='cart-modal__item__footer'>
          <div className='cart-modal__price'>{line.price}€</div>
          {readOnly ? (
            <div className='cart-modal__qty cart-modal__qty--static c-tag'>
              <span>× {line.quantity}</span>
            </div>
          ) : (
            <div className='flex gap-sm '>
              <button
                className='cart-modal__delete c-tag'
                onClick={() => removeFromCart(line.id)}>
                {tDelete}
              </button>
              <CartQtyStepper
                quantity={line.quantity}
                onDecrease={() => updateQuantity(line.id, line.quantity - 1)}
                onIncrease={() => updateQuantity(line.id, line.quantity + 1)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartProductItem;
