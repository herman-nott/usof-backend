async function handlePasswordReset(req, res, db, crypto, nodemailer) {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // поиск пользователя
        const user = await db('users').where({ email }).first();
        if (!user) {
            return res.status(400).json({ error: `Email ${email} does not exist` });
        }

        const genericResponse = { message: `A password reset link has been sent to email ${email}` };

        // удалить старые токены 
        await db('password_resets').where({ user_id: user.id }).del();

        // сгенерировать токен и захешировать его
        const confirm_token = crypto.randomBytes(32).toString('hex');
        const confirm_token_hash = crypto.createHash('sha256').update(confirm_token).digest('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 минут

        // сохранить хеш в БД
        await db('password_resets').insert({
            user_id: user.id,
            token_hash: confirm_token_hash,
            expires_at: expiresAt,
            used: false
        });

        // формирование ссылки сброса пароля
        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetLink = `${FRONTEND_URL}/api/auth/password-reset/${confirm_token}`;

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
                to: user.email,
                subject: 'Password reset',
                text: `You requested a password reset. Use the link below (valid 15 minutes):\n\n${resetLink}\n\nIf you didn't request this, ignore this message.`,
                html: `<p>You requested a password reset. Use the link below. The link is valid for 15 minutes:</p>
                        <p><a href="${resetLink}">${resetLink}</a></p>
                        <p>If you didn't request this, ignore this message.</p>`
            };

            await transporter.sendMail(mailOptions);
            console.log(`Password reset email sent to ${user.email}`);
        } catch (error) {
            console.error('Error sending password reset email:', error);
        }

        return res.json(genericResponse);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}

export default handlePasswordReset;