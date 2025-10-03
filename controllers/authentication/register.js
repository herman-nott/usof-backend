import User from "../../models/User.js";
import EmailVerification from "../../models/EmailVerification.js";

async function handleRegister(req, res, db, bcrypt, nodemailer) {
    const { login, password, password_confirmation, firstname, lastname, email } = req.body;
    const userModel = new User(db);
    const emailVerificationModel = new EmailVerification(db);

    try {
        if (password !== password_confirmation) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        if (!login || !email || !password || !password_confirmation) {
            return res.status(400).json({ error: "Please fill in all required fields" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must contain at least 6 characters" });
        }

        const existingLoginUser = await userModel.findByLogin(login);
        if (existingLoginUser && existingLoginUser.is_email_confirmed) {
            return res.status(400).json({ error: "Login is already taken" });
        }

        const existingEmailUser = await userModel.findByEmail(email);
        if (existingEmailUser && existingEmailUser.is_email_confirmed) {
            return res.status(400).json({ error: "Email is already registered" });
        }

        const hash = await bcrypt.hash(password, 10);

        let newUser;
        
        if ((existingLoginUser && !existingLoginUser.is_email_confirmed) || 
            (existingEmailUser && !existingEmailUser.is_email_confirmed)) {
            
            const userToUpdate = existingLoginUser || existingEmailUser;

            await userModel.update(userToUpdate.id, {
                login,
                password_hash: hash,
                full_name: `${firstname} ${lastname}`,
                email,
                updated_at: new Date()
            });
            newUser = await userModel.findById(existingEmailUser.id);
        } else {
            const id = await userModel.create({
                login: login,
                password_hash: hash,
                full_name: `${firstname} ${lastname}`,
                email: email,
                profile_picture: 'uploads/avatars/default.png', 
                rating: 0,
                role: 'user',
                created_at: new Date(),
                updated_at: new Date(),
                is_email_confirmed: false
            });

            newUser = await userModel.findById(id);
        }


        // сгенерировать 6-значный код и срок действия
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await emailVerificationModel.create(newUser.id, code, expiresAt);

        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });

            const mailOptions = {
                from: process.env.FROM_EMAIL,
                to: newUser.email,
                subject: 'Email Confirmation',
                text: `To complete your registration, please confirm your email.\n\nYour confirmation code: ${code}\n\nThis code is valid for 15 minutes.\n\nIf you did not sign up, ignore this message.`,
                html: `<p>To complete your registration, please confirm your email.</p>
                        <h2>Your confirmation code: <b>${code}</b></h2>
                        <p>This code is valid for <b>15 minutes</b>.</p>
                        <p>If you did not sign up, please ignore this email.</p>`
            };

            await transporter.sendMail(mailOptions);
            // console.log(`Password reset email sent to ${newUser.email}`);
        } catch (error) {
            // console.error('Error sending email confirmation email:', error);
            res.status(500).send('Unable to register');
        }

        // добавить сессию
        req.session.userId = newUser.id;
        req.session.user = {
            id: newUser.id,
            role: newUser.role,
            login: newUser.login
        };

        // вернуть пользователя без пароля
        // const { password_hash, ...safeUser } = newUser;
        // res.json(safeUser);

        res.json({
            message: "Please confirm your email using the 6-digit code sent to you."
        });
    } catch (error) {
        // console.error(error);
        res.status(500).send('Unable to register');
    }
}

export default handleRegister;