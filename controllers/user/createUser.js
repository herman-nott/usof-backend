import User from "../../models/User.js";

async function handleCreateUser(req, res, db, bcrypt) {
    try {
        const { login, password, password_confirmation, email, role } = req.body;

        if (!login || !password || !password_confirmation || !email || !role) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (password !== password_confirmation) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }

        const userModel = new User(db);
        const existingUser = await userModel.findByEmailOrLogin(login);
        if (existingUser) {
            return res.status(400).json({ error: "Login already exists" });
        }

        const existingEmail = await userModel.findByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const newUserId = await userModel.create({
            login: login,
            password_hash: password_hash,
            full_name: login,
            email: email,
            profile_picture: 'uploads/avatars/default.png',
            rating: 0,
            role: role,
            created_at: new Date(),
            updated_at: new Date(),
            is_email_confirmed: true
        });

        res.status(200).json({
            message: "User created successfully",
            user_id: newUserId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleCreateUser;