"use client";
import dynamic from "next/dynamic";

const CartModal = dynamic(() => import("../shop/CartModal"), { ssr: false });

export default CartModal;
