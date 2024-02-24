import express from 'express';
import { json } from 'body-parser';
import { tagRouter } from './routes/tag';
import mongoose from 'mongoose';

export const baseApiUrl = '/api';

const app = express();
app.use(json());

app.use(tagRouter);
mongoose.connect('mongodb+srv://food:food@cluster0.n2x7rui.mongodb.net/').then(() => { console.log('connected to database') });;

app.listen(3000, () => {
    console.log('Listening on port 3000');
});