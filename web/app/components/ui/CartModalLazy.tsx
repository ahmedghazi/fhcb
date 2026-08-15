"use client";
import dynamic from "next/dynamic";

const CartModal = dynamic(() => import("../CartModal"), { ssr: false });

export default CartModal;
