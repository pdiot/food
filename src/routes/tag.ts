import express, { Request, Response } from "express";
import { baseApiUrl } from "..";
import { Tag } from "../models/tag";

const router = express.Router();

router.get('/api/tags', async (req: Request, res: Response) => {
    try {
        const tags = await Tag.find({});
        return res.send(tags);
    } catch (error: any) {
        return res.status(400).send(error.message);
    }
});

router.post('/api/tags', async (req: Request, res: Response) => {
    const { label, color } = req.body;
    try {
        const tag = Tag.build({ label, color });
        await tag.save();
        return res.status(201).send(tag);
    } catch (error: any) {
        return res.status(400).send(error.message);
    }
});

export { router as tagRouter };