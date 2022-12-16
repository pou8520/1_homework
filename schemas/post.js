const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
})
module.exports= mongoose.model("Posts", postSchema);
