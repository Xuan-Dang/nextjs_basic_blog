import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    featureImage: {
      type: String,
    },
    galleryImage: {
      type: Array,
      default: [],
    },
    description: {
      type: String,
    },
    content: {
      type: String,
    },
    variantId: {
      type: Array,
      default: [],
      ref: "product_variant",
    },
    minPrice: {
      type: Number,
      default: 0,
    },
    maxPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.product || mongoose.model("product", productSchema);

export default Product;
