import User from "../../models/User.js";

async function handleDeleteUser(req, res, db) {
    try {
        const { user_id } = req.params;
        const userModel = new User(db);

        const user = await userModel.findById(user_id);
        if (!user) { 
            return res.status(404).json({ error: "User not found" });
        }

        const deletedCount = await userModel.deleteById(user_id);

        if (deletedCount > 0) {
            res.json({ message: "User deleted successfully" });
        } else {
            res.status(500).json({ error: "Failed to delete user" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleDeleteUser;