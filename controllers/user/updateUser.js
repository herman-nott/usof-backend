import User from "../../models/User.js";

async function handleUpdateUser(req, res, db) {
    try {
        const { user_id } = req.params;
        const updates = req.body;

        if (updates.password || updates.password_hash) {
            return res.status(400).json({ error: "Use dedicated route to update password" });
        }

        const userModel = new User(db);
        const updatedUser = await userModel.updateById(user_id, updates);

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const { password_hash, ...safeUser } = updatedUser;
        res.json(safeUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleUpdateUser;