import catchAsync from "../utils/catchAsync.js";
import Product from "./../models/productSchema.js";
import cloudinary from "cloudinary";
import fs from "fs";

export const createProduct = catchAsync(async (req, res, next) => {
  const { name, description, price, category, countInStock } = req.body;
  const product = await Product.create({
    name,
    description,
    price,
    category,
    countInStock,
  });
  const images = Array.isArray(req.files.images)
    ? req.files.images
    : [req.files.images];

  const uploadToServerPromises = images.map((image) => {
    return new Promise((resolve, reject) => {
      const path = `./uploads/${Date.now()}${image.name}`;
      image.mv(path, (err) => {
        if (err) reject(err);
        else resolve(path);
      });
    });
  });
  Promise.all(uploadToServerPromises)
    .then((paths) => {
      const cloudinaryPromises = paths.map((path) => {
        return new Promise((resolve, reject) => {
          cloudinary.v2.uploader
            .upload(path)
            .then((imageDetails) => {
              fs.unlink(path, (err) => {
                if (err) throw err;
              });
              resolve(imageDetails);
            })
            .catch((err) => reject(err));
        });
      });
      return cloudinaryPromises;
    })
    .then((cloudinaryPromises) => {
      Promise.all(cloudinaryPromises).then((imageDetails) => {
        imageDetails.forEach((image) => {
          product.images.push({
            url: image.secure_url,
            public_id: image.public_id,
          });
        });

        product.save().then(() => {
          res.status(200).json({ product });
        });
      });
    });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  await Product.findOneAndDelete(productId);
  res.status(200).json({
    message: "product deleted",
  });
});
