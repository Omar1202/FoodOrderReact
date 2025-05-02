import { act, createContext, useReducer } from "react";

export const CartContext = createContext({
    items: [],
    addItem: () => {},
    updateItem: () => {},
    cleanItems: () => {}
});

async function getItemById(id){ 
    const response = await fetch("http://localhost:3000/meals");
    const meals = await response.json();
    const item = meals.find( (meal) => meal.id === id );
    return item;
}

function updateCartActions(state, action) {
    if(action.method === "add") {
        // console.log(state.items);
        const updatedItems = [...state.items];

        const indexIfExists = updatedItems.findIndex(
            (cartItem) => cartItem.id === action.id
        )

        const itemIfExists = updatedItems[indexIfExists];

        if(itemIfExists) {
            const updatedItem = {
                ...itemIfExists,
                quantity: itemIfExists.quantity + 1
            };

            updatedItems[indexIfExists] = updatedItem;
        } else {
            // console.log(item);
            updatedItems.push({
                ...action.item,
                quantity: 1
            });
        }

        return {
            items: updatedItems
        }
    } else if (action.method === 'update') {
        const updatedItems = [...state.items];
        const itemIdx = updatedItems.findIndex( (item) => item.id === action.id );
        const item = {...updatedItems[itemIdx]}; //Esto es porque si no, no crea una copia del objeto sino que usa el objeto en sí

        if(item) {
            item.quantity += action.amount;

            if(item.quantity <= 0) {
                updatedItems.splice(itemIdx, 1);
            } else {
                updatedItems[itemIdx] = item;
            }
        }

        return {
            items: updatedItems
        };
    } else if (action.method === 'clean') {
        return {
            items: []
        }
    }

}


export function CartContextProvider({ children }) {

    const [cartState, cartDispatcher] = useReducer(updateCartActions, {
        items: []
    });

    async function addItemsToCart(id) {
        const item = await getItemById(id);
        cartDispatcher({
            method: 'add',
            item,
            id
        })
    }


    function updateItemsQuantityInCart(id, amount) {
        cartDispatcher({
            method: 'update',
            id: id,
            amount
        })
    }

    function cleanItemsInCart() {
        cartDispatcher({
            method: 'clean',
        })
    }

    const contextValue = {
        items: cartState.items,
        addItem: addItemsToCart,
        updateItem: updateItemsQuantityInCart,
        cleanItems: cleanItemsInCart
    }

    

    return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}