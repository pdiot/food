import express from 'express';
import { json } from 'body-parser';
import { tagRouter } from './routes/tag';
import mongoose from 'mongoose';
import { ingredientRouter } from './routes/ingredient';
import { recipeRouter } from './routes/recipe';
var cors = require('cors');

export const baseApiUrl = '/api';

const app = express();
app.use(cors())
app.use(json());

app.use('/api', tagRouter);
app.use('/api', ingredientRouter);
app.use('/api', recipeRouter);

mongoose.connect('mongodb+srv://food:food@cluster0.n2x7rui.mongodb.net/').then(() => { console.log('connected to database') });;

app.listen(3000, () => {
    console.log('Listening on port 3000');
});