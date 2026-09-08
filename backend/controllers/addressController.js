const User = require("../models/User");

const getAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("addresses");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user.addresses);
  } catch (error) { next(error); }
};

const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.isDefault) {
      user.addresses.forEach((address) => { address.isDefault = false; });
    }

    user.addresses.push(req.body);
    await user.save();
    res.status(201).json(user.addresses);
  } catch (error) { next(error); }
};

const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    if (req.body.isDefault) {
      user.addresses.forEach((item) => { item.isDefault = false; });
    }

    Object.assign(address, req.body);
    await user.save();
    res.status(200).json(user.addresses);
  } catch (error) { next(error); }
};

const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    address.deleteOne();
    await user.save();
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) { next(error); }
};

module.exports = { getAddress, addAddress, updateAddress, deleteAddress };
