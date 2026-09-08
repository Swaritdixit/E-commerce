const Product = require("../models/Product");
const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary");

const uploadFiles = async (files = []) => {
  const imageUrls = [];
  for (const file of files) {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "ecommerce-products" },
        (error, result) => error ? reject(error) : resolve(result)
      ).end(file.buffer);
    });

    imageUrls.push({ url: result.secure_url, publicId: result.public_id });
  }
  return imageUrls;
};

const addProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one product image is required" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) return res.status(404).json({ message: "Category not found" });

    const existing = await Product.findOne({ name: name.trim() });
    if (existing) return res.status(409).json({ message: "Product already exists" });

    const images = await uploadFiles(req.files);
    const product = await Product.create({
      name: name.trim(), description, price, category, stock, images
    });

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) { next(error); }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ product });
  } catch (error) { next(error); }
};

const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const categoryExists = await Category.findById(category);
    if (!categoryExists) return res.status(404).json({ message: "Category not found" });

    const update = { name: name.trim(), description, price, category, stock };

    if (req.files && req.files.length > 0) {
      const newImages = await uploadFiles(req.files);
      for (const image of product.images) {
        if (image.publicId) {
          await cloudinary.uploader.destroy(image.publicId).catch(() => {});
        }
      }
      update.images = newImages;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    ).populate("category");

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) { next(error); }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    for (const image of product.images) {
      if (image.publicId) await cloudinary.uploader.destroy(image.publicId).catch(() => {});
    }

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) { next(error); }
};

const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sort,
    } = req.query;

    const query = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (category) query.category = category;

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== "") query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== "") query.price.$lte = Number(maxPrice);
    }

    const sortOption = sort === "price" ? { price: 1 } : sort === "-price" ? { price: -1 } : { createdAt: -1 };
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(100, Math.max(1, Number(limit)));

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category")
        .sort(sortOption)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      product: products,
      products,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) { next(error); }
};

module.exports = {
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProducts,
};
