import Category from "../../models/Category.js";

async function handleDeleteCategory(req, res, db) {
    try {
        const { category_id } = req.params;

        if (!category_id) {
            return res.status(400).json({ error: "Category ID is required" });
        }

        const categoryModel = new Category(db);

        const deleted = await categoryModel.delete(category_id);

        if (!deleted) {
            return res.status(404).json({ error: "Category not found" });
        }

        return res.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export default handleDeleteCategory;