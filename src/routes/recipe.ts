import express from "express";
import { Recipe } from "../models/recipe";
import { Tag } from "../models/tag";
import { IIngredientDoc, Ingredient } from "../models/ingredient";

const router = express.Router();

router.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find({})
            .populate('tags')
            .populate('ingredients');
        return res.send(recipes);
    } catch (error: any) {
        return res.status(500).send(error.message);
    }
});

router.get('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate('tags')
            .populate('ingredients');
        if (!recipe) {
            return res.status(404).send('Recipe not found');
        }
        return res.send(recipe);
    } catch (error: any) {
        return res.status(500).send(error.message);
    }
});

router.post('/recipes', async (req, res) => {
    const { label, description, servings, tagIds, ingredientIdsAssos } = req.body;
    try {
        const tags = await Tag.find({ _id: { $in: tagIds } });

        // Ne pas faire de forEach dans une méthode async, parce que ça marche juste pas
        // Deux options possibles : for const of array ou Promise.all(array.map(async (element) => { await ici})) 
        // const ingredientAssos: { quantity: number, ingredient: IIngredientDoc }[] = [];
        // for (const ingredientAsso of ingredientIdsAssos) {
        //     let ingredientFromDb = await Ingredient.findById(ingredientAsso.ingredientId);
        //     if (ingredientFromDb) {
        //         ingredientAssos.push({ quantity: ingredientAsso.quantity, ingredient: ingredientFromDb });
        //     } else {
        //         throw new Error(`Ingredient not found with id ${ingredientAsso.ingredientId}`);
        //     }
        // };

        const ingredientAssos: { quantity: number, ingredient: IIngredientDoc }[] = await Promise.all(ingredientIdsAssos.map(async (ingredientAsso: { ingredientId: string, quantity: number }) => {
            let ingredientFromDb = await Ingredient.findById(ingredientAsso.ingredientId);
            if (ingredientFromDb) {
                return { quantity: ingredientAsso.quantity, ingredient: ingredientFromDb };
            } else {
                throw new Error(`Ingredient not found with id ${ingredientAsso.ingredientId}`);
            }
        }));

        const recipe = Recipe.build({ label, description, servings, tags, ingredients: ingredientAssos });
        // Ca sent le cul niveau perfs ça, mais bon, on verra plus tard
        (await
            (await
                (await recipe.save())
                    .populate('tags'))
                .populate('ingredients')
        );
        return res.status(201).send(recipe);
    } catch (error: any) {
        return res.status(500).send(error.message);
    }
});

router.patch('/recipes/:id', async (req, res) => {
    const { label, description, servings, tagIds, ingredientIdsAssos } = req.body;
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).send('Recipe not found');
        }

        if (label) {
            recipe.label = label;
        }
        if (description) {
            recipe.description = description;
        }
        if (servings) {
            recipe.servings = servings;
        }
        if (tagIds) {
            const tags = await Tag.find({ _id: { $in: tagIds } });
            recipe.tags = tags;
        }
        if (ingredientIdsAssos) {
            const ingredientAssos: { quantity: number, ingredient: IIngredientDoc }[] = await Promise.all(ingredientIdsAssos.map(async (ingredientAsso: { ingredientId: string, quantity: number }) => {
                let ingredientFromDb = await Ingredient.findById(ingredientAsso.ingredientId);
                if (ingredientFromDb) {
                    return { quantity: ingredientAsso.quantity, ingredient: ingredientFromDb };
                } else {
                    throw new Error(`Ingredient not found with id ${ingredientAsso.ingredientId}`);
                }
            }));
            recipe.ingredients = ingredientAssos;
        }

        const updated = await (await (await recipe.save()).populate('tags')).populate('ingredients');
        return res.status(200).send(updated);
    } catch (error: any) {
        return res.status(500).send(error.message);
    }
});

export { router as recipeRouter };