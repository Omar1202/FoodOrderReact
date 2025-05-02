import {useEffect} from "react";
import {useState} from "react";
import Meal from "./Meal.jsx";

export default function Meals() {
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
        <div id="meals">
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
        </div>
    )
}