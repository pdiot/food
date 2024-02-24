import express, { Request, Response } from "express";
import { baseApiUrl } from "..";
import { ITag, Tag } from "../models/tag";

const router = express.Router();

router.get('/tags', async (req: Request, res: Response) => {
    try {
        const tags = await Tag.find({});
        return res.send(tags);
    } catch (error: any) {
        return res.status(500).send(error.message);
    }
});

router.post('/tags', async (req: Request, res: Response) => {
    const { label, color } = req.body;
    try {
        const tag = Tag.build({ label, color });
        await tag.save();
        return res.status(201).send(tag);
    } catch (error: any) {
        return res.status(500).send(error.message);
    }
});

router.get('/tags/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const tag = await Tag.findById(id);
        if (!tag) {
            return res.status(404).send('Tag not found');
        }
        return res.send(tag);
    }
    catch (error: any) {
        return res.status(500).send(error.message);
    }
});

router.patch('/tags/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { label, color } = req.body;
    try {
        const patchData: Partial<ITag> = {};
        if (label) {
            patchData.label = label;
        }
        if (color) {
            patchData.color = color;
        }

        const tag = await Tag.findByIdAndUpdate(id, patchData, { new: true });
        if (!tag) {
            return res.status(404).send('Tag not found');
        }
        return res.status(200).send(tag);
    }
    catch (error: any) {
        return res.status(500).send(error.message);
    }
});

router.delete('/tags/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await Tag.findByIdAndDelete(id);
        return res.status(200).send('Tag deleted');
    }
    catch (error: any) {
        return res.status(500).send(error.message);
    }
});

export { router as tagRouter };