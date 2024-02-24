import mongoose from "mongoose";
import { ITag, ITagDoc } from "./tag";
import { IIngredient, IIngredientDoc } from "./ingredient";

export type RecipePostBody = {
    label: string,
    description: string,
    servings: number,
    tagIds: string[],
    ingredientIdsAssos: { ingredientId: string, quantity: number }[]
};

export interface IRecipe {
    label: string;
    description: string;
    servings: number;
    tags: ITagDoc[];
    ingredients: { quantity: number; ingredient: IIngredientDoc }[];
}

interface IRecipeModel extends mongoose.Model<IRecipeDoc> {
    build(attrs: IRecipe): IRecipeDoc;
}

interface IRecipeDoc extends mongoose.Document {
    label: string;
    description: string;
    servings: number;
    tags: ITagDoc[];
    ingredients: { quantity: number; ingredient: IIngredientDoc }[];
}

const recipeSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    servings: {
        type: Number,
        required: false
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    ingredients: [{

        ingredient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient'
        },
        quantity: {
            type: Number,
            required: true
        }
    },]
});

// Bien faire attention à définir le contenu de statics avant de créer le model
recipeSchema.statics.build = (attrs: IRecipe) => {
    return new Recipe(attrs);
};

const Recipe = mongoose.model<IRecipeDoc, IRecipeModel>('Recipe', recipeSchema);

export { Recipe };