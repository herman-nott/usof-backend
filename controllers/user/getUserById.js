import User from "../../models/User.js";

async function handleGetUserById(req, res, db) {
    try {
        const userModel = new User(db);

        const { user_id  } = req.params;

        const user = await userModel.findById(user_id );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleGetUserById;