async function handleLogin(req, res, db, bcrypt) {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
        return res.status(400).json('Incorrect form submission');
    }

    db.select('login', 'email', 'password_hash').from('users')
        .where(function () {
            this.where('email', '=', emailOrUsername)
                .orWhere('login', '=', emailOrUsername);
        })
        .then(async data => {
            try {
                const isValid = await bcrypt.compare(password, data[0].password_hash);

                if (isValid) {
                    return db.select('*').from('users')
                        .where(function () {
                            this.where('email', '=', emailOrUsername)
                                .orWhere('login', '=', emailOrUsername);
                        })
                        .then(user => {
                            // добавить сессию
                            req.session.userId = user[0].id;

                            // вернуть пользователя без пароля
                            const { password_hash, ...safeUser } = user[0];
                            res.json(safeUser);
                        })
                        .catch(err => res.status(400).json('Unable to get a user'));
                } else {
                    return res.status(400).json('Wrong credentials');
                }
            } catch (error) {
                res.status(500).json('Server error');
            }
        })
        .catch(err => res.status(400).json('Wrong credentials'));

}

export default handleLogin;