import {useEffect} from "react";
import Header from "./components/Header";
import {useState} from "react";
import Meal from "./components/Meal";
import Meals from "./components/Meals";
import { CartContextProvider } from './store/CartContext.jsx';

function App() {
    const [mealsState, setMealsState] = useState();

    useEffect(() => {
        async function getMeals() {
            const response = await fetch("http://localhost:3000/meals");
            const meals = await response.json();
            setMealsState(meals);
        }

        getMeals();
    }, []);

    return (
        <> 
        <CartContextProvider>
            < Header /> 
            <Meals>
                {
                    mealsState && mealsState.map(meal => {
                        return (
                            <Meal
                            key={meal.id}
                            id={meal.id}
                            name={meal.name}
                            price={meal.price}
                            description={meal.description}
                            image={meal.image}/>
                        )
                    })
                }
            </Meals>
        </CartContextProvider>
    </>
    );
}

export default App;
