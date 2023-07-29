import { nanoid } from "nanoid";
import productModel from "../../../../DB/model/Product.model.js";
import cloudinary from "../../../utils/Cloudinary.js";
import { asyncHandler } from "../../../utils/ErrorHandling.js";

export const productList = asyncHandler(async (_, res, next) => {
  const products = await productModel.find({});
  if (products.length === 0) {
    return next(new Error("No products Found", { cause: 400 }));
  }
  return res.status(200).json({ message: "Done", products });
});

export const viewProduct = asyncHandler(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);
  if (!req.params.id) {
    return next(new Error("No product Found", { cause: 400 }));
  }
  return res.status(200).json({ message: "Done", product });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);
  if (!product) {
    return next(new Error("No product Found", { cause: 400 }));
  }
  if (product.image.public_id) {
    const destroyImage = await cloudinary.uploader.destroy(
      product.image.public_id
    );

    if (destroyImage) {
      const deletedProduct = await productModel.findByIdAndDelete(
        req.params.id
      );
      return res.status(200).json({ message: "Done", deletedProduct });
    }
  } else {
    return next(
      new Error("Action terminated. Fail to delete product image", {
        cause: 400,
      })
    );
  }
});

export const editProduct = asyncHandler(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);
  if (!product) {
    return next(new Error("No product Found", { cause: 400 }));
  }
  if (req.file) {
    const destroyImage = await cloudinary.uploader.destroy(
      product.image.public_id
    );
    if (destroyImage) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: `${process.env.APP_NAME}/product/${product.customId}`,
        }
      );
      req.body.image = { secure_url, public_id };
      const { image, name, price, desc, brand, gender } = req.body;
      const updateProduct = await productModel.findByIdAndUpdate(
        req.params.id,
        {
          image: image || product.image,
          name: name || product.name,
          price: price || product.price,
          desc: desc || product.desc,
          brand: brand || product.brand,
          gender: gender || product.gender,
        },
        {
          new: true,
        }
      );
      return res.status(200).json({ message: "Done", updateProduct });
    }
  } else {
    const { name, price, desc, brand, gender } = req.body;
    const updateProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        image: product.image,
        name: name || product.name,
        price: price || product.price,
        desc: desc || product.desc,
        brand: brand || product.brand,
        gender: gender || product.gender,
      },
      {
        new: true,
      }
    );
    return res.status(200).json({ message: "Done", updateProduct });
  }
});

export const createProduct = asyncHandler(async (req, res, next) => {
  req.body.customId = nanoid();
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/product/${req.body.customId}`,
    }
  );
  req.body.image = { secure_url, public_id };
  const product = await productModel.create(req.body);
  if (!product) {
    return next(new Error("Fail to add product", { cause: 400 }));
  }
  return res.status(201).json({ message: "Done", product });
});
