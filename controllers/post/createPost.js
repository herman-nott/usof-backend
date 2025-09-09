import Post from "../../models/Post.js";
import PostCategory from "../../models/PostCategory.js";

async function handleCreatePost(req, res, db) {
    try {
        const { title, content, categories } = req.body;

        if (!title || !content || !categories || !Array.isArray(categories)) {
            return res.status(400).json({ error: "title, content and categories are required" });
        }

        const authorId = req.session.user.id;

        const postModel = new Post(db);
        const postCategoryModel = new PostCategory(db);

        const newPost = await postModel.create(authorId, title, content);

        await postCategoryModel.attachCategoriesToPost(newPost.id, categories);

        const categoriesList = await postCategoryModel.getCategoriesByPostId(newPost.id);

        res.status(201).json({
            ...newPost,
            categories: categoriesList
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleCreatePost;