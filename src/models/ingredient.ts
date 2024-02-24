import mongoose from "mongoose";

export interface IIngredient {
    label: string;
    unit: string;
    price: number;
    calories: number;
}

interface IIngredientModel extends mongoose.Model<IIngredientDoc> {
    build(attrs: IIngredient): IIngredientDoc;
}

export interface IIngredientDoc extends mongoose.Document {
    label: string;
    unit: string;
    price: number;
    calories: number;
}

const ingredientSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: false
    },
    calories: {
        type: Number,
        required: false
    }
});

// Bien faire attention à définir le contenu de statics avant de créer le model
ingredientSchema.statics.build = (attrs: IIngredient) => {
    return new Ingredient(attrs);
};

const Ingredient = mongoose.model<IIngredientDoc, IIngredientModel>('Ingredient', ingredientSchema);

export { Ingredient };