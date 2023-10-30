import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema(
  {
    productId: { type: String, ref: "product" },
    variantCode: { type: Number },
    price: { type: Number, default: 0 },
    onSale: { type: Number, default: 0 },
    inStock: { type: Number, default: 0 },
    variantImage: { type: String },
  },
  { timestamps: true }
);

const ProductVariant =
  mongoose.models.product_variant ||
  mongoose.model("product_variant", productVariantSchema);

export default ProductVariant;
