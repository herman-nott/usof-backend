import User from "../../models/User.js";

async function handleGetAllUsers(req, res, db) {
    try {
        const userModel = new User(db);
        
        const users = await userModel.selectAll();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleGetAllUsers;