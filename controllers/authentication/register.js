async function handleRegister(req, res, db, bcrypt) {
    const { login, password, password_confirmation, firstname, lastname, email, is_email_confirmed } = req.body;

    try {
        if (password !== password_confirmation) {
            return res.status(400).send('Passwords don\'t match');
        } else if (!is_email_confirmed) {
            return res.status(400).send('Email is not confirmed')
        }

        const hash = await bcrypt.hash(password, 10);

        const [id] = await db('users').insert({
            login: login,
            password_hash: hash,
            full_name: `${firstname} ${lastname}`,
            email: email,
            profile_picture: 'default.png',
            rating: 0,
            role: 'user',
            created_at: new Date(),
            updated_at: new Date(),
            is_email_confirmed: is_email_confirmed
        });

        const newUser = await db('users').where({ id }).first();

        // добавить сессию
        req.session.userId = newUser.id;

        // вернуть пользователя без пароля
        const { password_hash, ...safeUser } = newUser;
        res.json(safeUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Unable to register');
    }
}

module.exports = {
    handleRegister
};