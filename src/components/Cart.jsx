import { useContext } from "react"
import { CartContext } from "../store/CartContext"

export default function Cart({ onCancel, onCheckout }) {
    const { items, updateItem } = useContext(CartContext);
    
    const total = items.reduce(
        (accumulated, item) => accumulated + item.price * item.quantity,
        0
        );
    const formattedTotal = `$${total.toFixed(2)}`;

    return (
        <>
            <div className="cart">
                <h2>Your Cart</h2>
                {/* <p className="cart total">Total Amount: {formattedTotal}</p> */}
                {items.length === 0 && <p>Your Cart it's empty.</p>}
                {items.length > 0 && (
                    <ul>
                        {items.map( (item) => {
                            const formattedPrice = `$${parseFloat(item.price).toFixed(2)}`;

                            return (
                                <li className="cart-item" key={item.id}>
                                    <p>
                                        {item.name} - {item.quantity} x {formattedPrice}
                                    </p>
                                    
                                    <div className="cart-item-actions">
                                        <button onClick={() => updateItem(item.id, -1)}>
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateItem(item.id, 1)}>
                                            +
                                        </button>
                                    </div>
                                </li>
                            );
                        } )}
                        <li className="cart-total">
                        {formattedTotal}
                        </li>
                    </ul>
                )}
            </div>
            <div className="modal-actions">
                <button className="text-button" onClick={onCancel}>Cancel</button>
                <button className="button" onClick={onCheckout} disabled={items.length > 0 ? false: true}>Go to Checkout</button>
            </div>
        </>
    )
}