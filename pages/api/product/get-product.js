import db from "../configs/connectDB";
import Product from "../models/productModel";
import ProductVariant from "../models/productVariantModel";

db();

export default async function (req, res) {
  switch (req.method) {
    case "GET": {
      await getProduct(req, res);
      break;
    }
  }
}

async function getProduct(req, res) {
  try {
    const products = await Product.find().populate({path: "variantId", select: "price onSale"})
    return res.status(200).json({
      code: 200,
      products,
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      message: err.message,
    });
  }
}
