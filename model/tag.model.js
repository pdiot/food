const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Tag', tagSchema);