import Category from "../../models/Category.js";

async function handleGetAllCategories(req, res, db) {
    try {
        const categoryModel = new Category(db);

        const categories = await categoryModel.selectAll();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleGetAllCategories;