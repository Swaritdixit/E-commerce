const Category = require("../models/Category");

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ categories });
  } catch (error) { next(error); }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ category });
  } catch (error) { next(error); }
};

const addCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }

    const exists = await Category.findOne({ name: name.trim() });
    if (exists) return res.status(409).json({ message: "Category already exists" });

    const category = await Category.create({
      name: name.trim(),
      description,
      image: image ? [{ url: image }] : [],
    });

    res.status(201).json({ message: "Category created", category });
  } catch (error) { next(error); }
};

const updateCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    const update = { name, description };
    if (image !== undefined) update.image = image ? [{ url: image }] : [];

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );

    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) { next(error); }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) { next(error); }
};

module.exports = {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};
