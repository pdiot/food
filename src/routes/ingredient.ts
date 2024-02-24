import express from "express";
import { IIngredient, Ingredient, IngredientPostBody } from "../models/ingredient";

const router = express.Router();

router.get('/ingredients', async (req, res) => {
    try {
        const ingredients = await Ingredient.find({});
        return res.send(ingredients);
    } catch (error: any) {
        return res.status(500).send(error.message);
    }
});
router.post('/ingredients', async (req, res) => {
    const { label, unit, price, calories } = req.body as IngredientPostBody;
    try {
        const ingredient = Ingredient.build({ label, unit, price, calories });
        await ingredient.save();
        return res.status(201).send(ingredient);
    } catch (error: any) {
        return res.status(500).send(error.message);
    }
});

router.get('/ingredients/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const ingredient = await Ingredient.findById(id);
        if (!ingredient) {
            return res.status(404).send('Ingredient not found');
        }
        return res.status(200).send(ingredient);
    }
    catch (error: any) {
        return res.status(500).send(error.message);
    }
});

router.patch('/ingredients/:id', async (req, res) => {
    const { id } = req.params;
    const { label, unit, price, calories } = req.body as Partial<IngredientPostBody>;
    try {
        const patchData: Partial<IIngredient> = {};
        if (label) {
            patchData.label = label;
        }
        if (unit) {
            patchData.unit = unit;
        }
        if (price) {
            patchData.price = price;
        }
        if (calories) {
            patchData.calories = calories;
        }

        const ingredient = await Ingredient.findByIdAndUpdate(id, patchData, { new: true });
        if (!ingredient) {
            return res.status(404).send('Ingredient not found');
        }
        return res.status(200).send(ingredient);
    }
    catch (error: any) {
        return res.status(500).send(error.message);
    }
});

router.delete('/ingredients/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const ingredient = await Ingredient.findById(id);
        if (!ingredient) {
            return res.status(404).send('Ingredient not found');
        }
        await Ingredient.findByIdAndDelete(id);
        return res.status(200).send({ response: 'Ingredient deleted' });
    }
    catch (error: any) {
        return res.status(500).send(error.message);
    }
});

export { router as ingredientRouter };