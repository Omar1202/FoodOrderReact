import { useActionState, useContext, useState } from "react";
import { CartContext } from "../store/CartContext";


async function sendOrderToServer(order) {
    const req = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({order})
    });
    
    if (!req.ok) {
        return false;
    }
    return true;

}


export default function Order({ onCancel }) {
    const [formState, formAction] = useActionState(processFormStateActions, {errors: [], order: {}});
    const [submitState, setSubmitState] = useState(false);
    const { items, cleanItems } = useContext(CartContext);

    const total = items.reduce(
        (accumulated, item) => accumulated + item.price * item.quantity,
        0
        );
    const formattedTotal = `$${total.toFixed(2)}`;
    
    async function processFormStateActions(prevState, formData) {
        const name = formData.get("name");
        const email = formData.get("email");
        const street = formData.get("street");
        const postalCode = formData.get("postalCode");
        const city = formData.get("city");

        let errors = [];
        let order = {};

        if(name.trim() === '' || name === null || 
           street === null || street.trim() === '' || 
           postalCode === null || postalCode.trim() === '' ||
           city === null || city.trim() === '' || 
           email.trim() === '' || email === null) {
               errors.push("Please fill all the inputs.");
        }

        else if(!email.includes("@") || !email.includes(".")) {
            errors.push("Please provide a valid email.")
        }

        if(errors.length > 0) {
            return {
                errors,
                order: {
                    customer: {name,email,street,"postal-code": postalCode,city}
                }
            }
        }
        order = {
            customer: {name,email,street,"postal-code": postalCode,city},
            items
        }
        const status = await sendOrderToServer(order);
        if(!status) {
            errors.push("Failed to send Order. Please try again later.");
            return {
                errors,
                order: {
                    customer: {name,email,street,"postal-code": postalCode,city},
                }
            }
        }
        setSubmitState(true);
        cleanItems();
        return {errors: [], order: {}};

    }
    return (
        <>
            {!submitState && (
                <div className="cart">
                    <h2>Checkout</h2>
                    <p className="cart total">Total Amount: {formattedTotal}</p>
                    <form action={formAction}>
                        <div className="control">
                            <label>Full Name</label>
                            <input type="text" name="name" defaultValue={formState.order?.customer?.name} />
                        </div>

                        <div className="control">
                            <label>Email Address</label>
                            <input type="text" name="email" defaultValue={formState.order?.customer?.email} />
                        </div>

                        <div className="control">
                            <label>Steet</label>
                            <input type="text" name="street" defaultValue={formState.order?.customer?.street} />
                        </div>

                        <div className="control-row">
                            <div className="control">
                                <label>Postal Code</label>
                                <input type="text" name="postalCode" defaultValue={formState.order?.customer?.postalCode} />
                            </div>

                            <div className="control">
                                <label>City</label>
                                <input type="text" name="city" defaultValue={formState.order?.customer?.city} />
                            </div>
                        </div>

                        {formState.errors.length > 0 && (
                            <div className="error">
                                {formState.errors.map( (error) => {
                                    return (
                                        <h2 key={error}>{error}</h2>
                                    )
                                } )}
                            </div>
                        )}

                        <div className="modal-actions">
                            <button className="text-button" onClick={onCancel}>Cancel</button>
                            <button className="button">Submit Order</button>
                        </div>
                    </form>
                </div>
            )}
            {submitState && (
                <div className="cart">
                    <h2>Success!</h2>
                    <p>Your order was submitted successfully.</p>
                    <p>We will get back to you with more details via email within the next few minutes.</p>
                    <div className="modal-actions">
                        <button className="button" onClick={onCancel}>Okay</button>
                    </div>
                </div>
            )}
        </>
    )   
}