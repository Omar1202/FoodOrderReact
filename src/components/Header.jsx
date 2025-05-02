import { useContext, useEffect, useState, useRef } from "react";
import logo from "../assets/logo.jpg";
import { CartContext } from "../store/CartContext";
import Modal from "./Modal";
import Order from "./Order";
import Cart from "./Cart";

export default function Header() {
    const [cartItems, setCartItems] = useState(0);
    const [cartModal, setCartModal] = useState(false);
    const [cartOrder, setOrderModal] = useState(false);
    
    const { items } = useContext(CartContext);

    function onCloseCart() {
        setCartModal(false);
    }

    function onOpenCart() {
        setCartModal(true);
    }

    function onCloseOrder() {
        setOrderModal(false);
    }

    function onOpenOrder() {
        setCartModal(false);
        setOrderModal(true);
    }

    useEffect( () => {
        setCartItems( (prevState) => items != null ? items.length: 0 );
    }, [items])

    return (
        <>
            <Modal open={cartModal} onCloseF={onCloseCart}>
                {cartModal && <Cart onCancel={onCloseCart} onCheckout={onOpenOrder} />}
            </Modal>

            <Modal open={cartOrder} onCloseF={onCloseOrder}>
                {cartOrder && <Order onCancel={onCloseOrder} />}
            </Modal>

            <header id="main-header">
                <div id="title">
                    <img src={logo} alt="" />
                    <h1 >REACT FOOD</h1>
                </div>
                <button className="text-button" onClick={onOpenCart}>Cart({cartItems})</button>
            </header>
        </>
    )
}