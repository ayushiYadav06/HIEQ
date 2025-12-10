const ListManagement = require("../models/ListManagement");

// GET /api/admin/listmanagement/:type
// Get all items by type (Skills, College, Jobs, Industries)
exports.getByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { search, status } = req.query;

    const allowedTypes = ["Skills", "College", "Jobs", "Industries"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const filter = { type };

    if (search) {
      filter.name = new RegExp(search, "i");
    }

    if (status !== undefined) {
      filter.status = status === "true" || status === "active";
    }

    const items = await ListManagement.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.json(items);
  } catch (err) {
    console.error("getByType error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/listmanagement/:type/:id
// Get single item by ID
exports.getById = async (req, res) => {
  try {
    const { type, id } = req.params;

    const allowedTypes = ["Skills", "College", "Jobs", "Industries"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const item = await ListManagement.findOne({ _id: id, type }).lean();

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    console.error("getById error:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/admin/listmanagement/:type
// Create new item
exports.create = async (req, res) => {
  try {
    const { type } = req.params;
    const { name, status } = req.body;

    const allowedTypes = ["Skills", "College", "Jobs", "Industries"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const item = new ListManagement({
      name: name.trim(),
      status: status !== undefined ? status : true,
      type,
    });

    await item.save();

    res.status(201).json(item);
  } catch (err) {
    console.error("create error:", err);
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Item with this name already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/listmanagement/:type/:id
// Update item
exports.update = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { name, status } = req.body;

    const allowedTypes = ["Skills", "College", "Jobs", "Industries"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const updateData = {};
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: "Name cannot be empty" });
      }
      updateData.name = name.trim();
    }
    if (status !== undefined) {
      updateData.status = status;
    }
    updateData.updatedAt = new Date();

    const item = await ListManagement.findOneAndUpdate(
      { _id: id, type },
      updateData,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    console.error("update error:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Item with this name already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/admin/listmanagement/:type/:id
// Delete item
exports.delete = async (req, res) => {
  try {
    const { type, id } = req.params;

    const allowedTypes = ["Skills", "College", "Jobs", "Industries"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const item = await ListManagement.findOneAndDelete({ _id: id, type });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("delete error:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/listmanagement/:type/:id/status
// Toggle status
exports.toggleStatus = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { status } = req.body;

    const allowedTypes = ["Skills", "College", "Jobs", "Industries"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    if (status === undefined) {
      return res.status(400).json({ message: "Status is required" });
    }

    const item = await ListManagement.findOneAndUpdate(
      { _id: id, type },
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    console.error("toggleStatus error:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

