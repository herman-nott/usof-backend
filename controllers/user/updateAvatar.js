import User from "../../models/User.js";

function handleUpdateAvatar(req, res, db) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const userId = req.session.user.id;
        const avatarPath = `/uploads/avatars/${req.file.filename}`;

        const userModel = new User(db);
        userModel.updateAvatar(userId, avatarPath);

        res.json({ message: "Avatar updated successfully", avatar: avatarPath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleUpdateAvatar;