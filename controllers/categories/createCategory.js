import Category from "../../models/Category.js";

async function handleCreateCategory(req, res, db) {
    try {
        const { title, description } = req.body;

        if (!title || title.trim() === "") {
            return res.status(400).json({ error: "Title is required" });
        }

        const categoryModel = new Category(db);

        const newCategory = await categoryModel.create({
            title: title.trim(),
            description: description || null,
        });

        res.status(201).json(newCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleCreateCategory;