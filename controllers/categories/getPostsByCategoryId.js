import Post from "../../models/Post.js";
import Category from "../../models/Category.js";

async function handleGetPostsByCategoryId(req, res, db) {
    try {
        const { category_id } = req.params;
        
        const postModel = new Post(db);
        const categoryModel = new Category(db);

        const category = await categoryModel.findById(category_id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        const posts = await postModel.findPostsByCategoryId(category_id);

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export default handleGetPostsByCategoryId;