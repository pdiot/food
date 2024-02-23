const express = require('express');
const TagModel = require('../model/tag.model');

const router = express.Router()

module.exports = router;

const baseUrl = `/tags`;

//Post Method
router.post(`${baseUrl}`, async (req, res) => {
    const tag = new TagModel({
        label: req.body.label,
        color: req.body.color
    });

    try {
        const newTag = await tag.save();
        res.status(201).json(newTag);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

//Get all Method
router.get(`${baseUrl}`, async (req, res) => {
    try {
        const tags = await TagModel.find();
        res.json(tags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//Get by ID Method
router.get(`${baseUrl}/:id`, async (req, res) => {
    try {
        const tag = await TagModel.findById(req.params.id);
        res.json(tag);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//Update by ID Method
router.put(`${baseUrl}/:id`, async (req, res) => {
    try {
        const tag = await TagModel.findById(req.params.id);
        tag.label = req.body.label;
        tag.color = req.body.color;
        const updatedTag = await tag.save();
        res.json(updatedTag);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//Delete by ID Method
router.delete(`${baseUrl}/:id`, async (req, res) => {
    try {
        const data = await TagModel.findByIdAndDelete(req.params.id);
        res.send(`Tag with id ${req.params.id} has been deleted`);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})