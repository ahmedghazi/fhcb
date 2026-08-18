import React from "react";

type Props = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

const CartQtyStepper = ({ quantity, onDecrease, onIncrease }: Props) => {
  return (
    <div className='cart-modal__qty c-tag'>
      <button onClick={onDecrease} disabled={quantity <= 1}>
        —
      </button>
      <span>{quantity}</span>
      <button onClick={onIncrease}>+</button>
    </div>
  );
};

export default CartQtyStepper;
