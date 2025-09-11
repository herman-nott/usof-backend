import Category from "../../models/Category.js";

async function handleGetCategoryById(req, res, db) {
    try {
        const { category_id } = req.params;
        const categoryModel = new Category(db);

        const category = await categoryModel.findById(category_id);

        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleGetCategoryById;