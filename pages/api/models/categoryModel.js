import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    name: {type: String, required: true},
    url: {type: String, required: true},
    description: {type: String},
    image: {type: String, default: "/images/default-image.png"}
}, {timestamps: true})

const Category = mongoose.models.category || mongoose.model("category", categorySchema);

export default Category