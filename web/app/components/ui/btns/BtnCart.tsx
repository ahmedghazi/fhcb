import useCart from "@/app/context/CartContext";
import { _localizeText } from "@/app/sanity-api/utils";
import React from "react";

type Props = {};

const BtnCart = (props: Props) => {
  const { cartCount, toggleCart } = useCart();

  return (
    <button className='btn--cart-toggle' onClick={toggleCart}>
      <div className='shade'></div>
      <svg
        width='31'
        height='31'
        viewBox='0 0 31 31'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M15.5 31C24.0604 31 31 24.0604 31 15.5C31 6.93959 24.0604 0 15.5 0C6.93959 0 0 6.93959 0 15.5C0 24.0604 6.93959 31 15.5 31Z'
          fill='#ff5524'
          className='fill--accent'
        />
        <path
          d='M25.4409 21.4698L24.3809 7.49977H20.2909C20.2509 4.87977 18.1209 2.75977 15.4909 2.75977C12.8609 2.75977 10.7309 4.87977 10.6909 7.49977H6.60088L5.55088 21.4298C5.39088 22.4698 5.68088 23.5098 6.35088 24.2898C6.97088 25.0198 7.86088 25.4298 8.79088 25.4298H22.1809C23.1109 25.4298 24.0009 25.0098 24.6209 24.2898C25.2909 23.5098 25.5809 22.4598 25.4209 21.4598L25.4409 21.4698ZM15.5009 3.75977C17.5809 3.75977 19.2609 5.42977 19.3009 7.49977H11.7109C11.7509 5.42977 13.4309 3.75977 15.5109 3.75977H15.5009ZM23.8809 23.6398C23.4409 24.1498 22.8409 24.4298 22.1909 24.4298H8.80088C8.15088 24.4298 7.55088 24.1498 7.11088 23.6398C6.63088 23.0798 6.42088 22.3298 6.54088 21.5398L7.53088 8.49977H10.6909V11.2298H11.6909V8.49977H19.3009V11.2298H20.3009V8.49977H23.4609L24.4509 21.5798C24.5709 22.3298 24.3609 23.0798 23.8809 23.6398Z'
          fill='white'
          className='fill--white'
        />
      </svg>
      <span className='btn--cart-toggle__count'>{cartCount}</span>
    </button>
  );
};

export default BtnCart;
