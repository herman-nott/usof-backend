import User from "../../models/User.js";

async function handleLogin(req, res, db, bcrypt) {
    const { emailOrLogin, password } = req.body;
    const userModel = new User(db);

    if (!emailOrLogin || !password) {
        return res.status(400).json('Incorrect form submission');
    }

    try {
        const user = await userModel.findByEmailOrLogin(emailOrLogin);

        if (!user) {
            return res.status(400).json('Wrong credentials');
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(400).json('Wrong credentials');
        }

        // добавить сессию
        // req.session.userId = user.id;
        req.session.user = {
            id: user.id,
            role: user.role,
            login: user.login
        };

        // вернуть пользователя без пароля
        const { password_hash, ...safeUser } = user;
        res.json(safeUser);

    } catch (error) {
        // console.error(error);
        res.status(500).json('Server error');
    }
}

export default handleLogin;