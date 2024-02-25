import express from "express";
import { IRecipe, IRecipeDoc, Recipe } from "../models/recipe";
import { IIngredientDoc } from "../models/ingredient";

interface PlannerDayData {
    dayLabel: string;
    noonServings: Serving[];
    eveningServings: Serving[];
}

interface Serving {
    recipeId: string;
    recipeLabel: string;
    calories?: number;
    price?: number;
}

const router = express.Router();

router.post('/planner/print', async (req, res) => {
    try {
        console.log(req.body);
        const plannerDays = req.body as PlannerDayData[];

        const recipeIds = plannerDays.map(day => {
            const recipeIds = day.noonServings.concat(day.eveningServings).map(serving => serving.recipeId);
            return recipeIds;
        });

        const distinctRecipeIds = [...new Set(recipeIds.flat())];
        console.log(distinctRecipeIds);

        const recipes = await Promise.all(distinctRecipeIds.map(async (recipeId) => Recipe.findById(recipeId).populate('tags').populate('ingredients.ingredient')));

        // Trouver le nombre de fois que chaque recette est utilisée en comptant les servings

        let recipeUsed: { recipe: IRecipeDoc, count: number }[] = [];

        recipes.forEach((recipe) => {
            console.log('recipe', recipe?.label)
            if (recipe === null) return;
            let count = 0;
            plannerDays.forEach((day) => {
                count += day.noonServings.filter(serving => serving.recipeId === recipe.id).length;
                count += day.eveningServings.filter(serving => serving.recipeId === recipe.id).length;
            });

            console.log(`count for ${recipe.label}`, count);

            let floor = Math.floor(count / recipe.servings);
            console.log('floor', floor)
            const remainder = count % recipe.servings;
            if (remainder !== 0) {
                floor++;
            }

            console.log(`${recipe.label} used nb times : `, floor);
            recipeUsed.push({ recipe, count: floor });
        });

        const ingredients: { quantity: number, ingredient: IIngredientDoc }[] = [];
        recipeUsed.forEach((recipeUsed) => {
            recipeUsed.recipe.ingredients.forEach((ingredientAsso) => {
                addToIngredientArray(ingredients, ingredientAsso.ingredient, ingredientAsso.quantity * recipeUsed.count);
            });
        });

        console.log('ingredients', ingredients);

        const reminder = buildPlannerMealsReminder(plannerDays);
        console.log('reminder', reminder);
        const shoppingList = buildShoppingList(ingredients);
        console.log('shoppingList', shoppingList);

        return res.status(200).send(JSON.stringify(reminder + '\n' + shoppingList));

    }
    catch (error: any) {
        return res.status(500).send(error.message);
    }
});

const addToIngredientArray = (ingredientArray: { quantity: number, ingredient: IIngredientDoc }[], ingredient: IIngredientDoc, quantity: number) => {
    const ingredientAsso = ingredientArray.find(ingredientAsso => ingredientAsso.ingredient.id === ingredient.id);
    if (ingredientAsso) {
        ingredientAsso.quantity += quantity;
    } else {
        ingredientArray.push({ ingredient, quantity });
    }
};

const buildShoppingList = (ingredients: { quantity: number, ingredient: IIngredientDoc }[]): string => {
    let shoppingList = '\nListe de courses :';
    ingredients.forEach((ingredientAsso) => {
        shoppingList += `\n\t${ingredientAsso.ingredient.label} : ${ingredientAsso.quantity} ${ingredientAsso.ingredient.unit}`;
    });
    return shoppingList;
};

const buildPlannerMealsReminder = (plannerDays: PlannerDayData[]): string => {
    let reminder = 'Rappel des repas de la semaine : \n';
    plannerDays.forEach((day) => {
        reminder += `\n Le ${day.dayLabel} :`;
        reminder += `\n\t Midi : ${day.noonServings.map(serving => serving.recipeLabel).join(', ')}`;
        reminder += `\n\t Soir : ${day.eveningServings.map(serving => serving.recipeLabel).join(', ')}`;
    });
    return reminder;
}

export { router as plannerRouter };