import catchAsync from "../utils/catchAsync.js";
import Product from "./../models/productSchema.js";
import ApiError from "./../utils/ApiError.js";
import cloudinary from "cloudinary";
import fs from "fs";
import User from "./../models/userSchema.js";
import ApiFeatures from "../utils/ApiFeatures.js";

export const createProduct = catchAsync(async (req, res, next) => {
  if (!req.files || !req.files.images)
    return next(new ApiError(400, "no images to upload"));
  const images = Array.isArray(req.files["images"])
    ? req.files["images"]
    : [req.files["images"]];
  if (images.length === 0)
    return next(new ApiError(400, "no images to upload"));
  const validFormats = ["jpg", "jpeg", "png"];

  for (let image in images) {
    console.log(images[image]);
    if (images[image].size / 1024 ** 2 > 1.5)
      return next(
        new ApiError(
          400,
          `${images[image].name} should have size less than 1.5 mb.`
        )
      );
    const nameArr = images[image].name.split(".");
    if (!validFormats.includes(nameArr[nameArr.length - 1]))
      return next(
        new ApiError(
          400,
          `invalid format { ${images[image].name}}, only ${validFormats} are allowed`
        )
      );
  }
  const { name, description, price, category, countInStock, forWhom } =
    req.body;
  const product = await Product.create({
    name,
    description,
    price,
    category,
    countInStock,
    forWhom,
  });

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

export const getAllProduct = catchAsync(async (req, res, next) => {
  // const products = await Product.find();
  const totalDoc = await Product.countDocuments();
  const features = new ApiFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .pagination(totalDoc)
    .search();
  const products = await features.query;
  res.status(200).json({
    products,
  });
});

export const getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate({
    path: "reviews",
    select: "title author rating -product",
    populate: {
      path: "author",
      model: User,
      select: "name avatar",
    },
  });
  if (!product) return next(new ApiError(400, "no product found with this id"));
  res.status(200).json({ product });
});

export const updateProductDetails = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  let product = await Product.findById(productId);
  if (!product) return next(new ApiError(404, "product does not exist"));
  product.name = req.body.name || product.name;
  product.description = req.body.description || product.description;
  product.price = req.body.price || product.price;
  product.category = req.body.category || product.category;
  product.countInStock = req.body.countInStock || product.countInStock;
  product = await product.save();
  res.status(200).json({ product });
});

export const addImagesToProduct = catchAsync(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) return next(new ApiError(404, "product does not exists"));
  if (!req.files || !req.files.images)
    return next(new ApiError(400, "no images to upload"));
  const images = Array.isArray(req.files.images)
    ? req.files.images
    : [req.files.images];
  const validFormats = ["jpg", "jpeg", "png"];
  for (let image in images) {
    if (images[image].size / 1024 ** 2 > 1.5)
      return next(
        new ApiError(
          400,
          `${images[image].name} should have size less than 1.5 mb.`
        )
      );
    const nameArr = images[image].name.split(".");
    if (!validFormats.includes(nameArr[nameArr.length - 1]))
      return next(
        new ApiError(
          400,
          `invalid format { ${images[image].name}}, only ${validFormats} are allowed`
        )
      );
  }
  const uploadToServerPromises = images.map((image) => {
    return new Promise((resolve, reject) => {
      const path = `./uploads/${Date.now()}${image.name}`;
      image.mv(path, (err) => {
        if (err) reject(err);
        else resolve(path);
      });
    });
  });
  const paths = await Promise.all(uploadToServerPromises);
  const uploadToCloudinaryPromises = paths.map((path) => {
    return cloudinary.v2.uploader.upload(path);
  });
  const uploadedImages = await Promise.all(uploadToCloudinaryPromises);
  paths.forEach((path) => {
    fs.unlink(path, (err) => {
      if (err) return next(new ApiError(500, "Something went wrong"));
    });
  });
  uploadedImages.forEach((img) => {
    const imgObj = { public_id: img.public_id, url: img.secure_url };
    product.images.push(imgObj);
  });
  product = await product.save();
  res.status(200).json(product);
});

export const deleteImageFromProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.productId;
  let product = await Product.findById(productId);
  if (!product) return next(new ApiError(404, "product does not exist"));
  const imageId = req.params.imageId;
  const updatedImages = product.images.filter((image) => {
    return image.public_id !== imageId;
  });
  await cloudinary.v2.uploader.destroy(imageId);
  product.images = updatedImages;
  product = await product.save();
  res.status(200).json({
    product,
  });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) return next(new ApiError(404, "product does not exists"));
  await Promise.all(
    product.images.map((img) => cloudinary.v2.uploader.destroy(img.public_id))
  );
  res.status(200).json({
    message: "product deleted",
  });
});

export const getStats = catchAsync(async (req, res, next) => {
  const type = req.params.type;

  const categories = await Product.aggregate([
    {
      $group: {
        _id: `$${type}`,
        count: { $sum: 1 },
        avgPrice: { $avg: "$price" },
        maxPrice: {
          $max: "$price",
        },
        minPrice: {
          $min: "$price",
        },
      },
    },
  ]);
  res.status(200).json({ categories });
});
