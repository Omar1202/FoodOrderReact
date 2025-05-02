import { useContext } from "react"
import { CartContext } from "../store/CartContext"

export default function Meal({id, name, price, description, image}) {
    const { addItem } = useContext(CartContext);

    function onClickAddToCart() {
        addItem(id)
    } 

    return (
        <div className="meal-item">
            <article>
                <img src={"http://localhost:3000/" + image} alt=""/>
                <div>
                    <h3>{name}</h3>
                    <p className="meal-item-price">
                        {new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(price)}
                    </p>
                    <p className="meal-item-description">
                        {description}
                    </p>
                </div>

                <div className="meal-item-actions">
                    <button className="button" onClick={onClickAddToCart}>
                        Add to Cart
                    </button>
                </div>
            </article>
        </div>
    )
}