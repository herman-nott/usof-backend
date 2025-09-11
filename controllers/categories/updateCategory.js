import Category from "../../models/Category.js";

async function handleUpdateCategory(req, res, db) {
    try {
        const { category_id } = req.params;
        const { title, description } = req.body;

        const categoryModel = new Category(db);

        const existing = await categoryModel.findById(category_id);
        if (!existing) {
            return res.status(404).json({ error: "Category not found" });
        }

        const updatedCategory = await categoryModel.update(category_id, title, description);

        res.json(updatedCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export default handleUpdateCategory;