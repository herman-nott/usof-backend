import User from "../../models/User.js";
import EmailVerification from "../../models/EmailVerification.js";

async function handleVerifyEmail(req, res, db) {
    const { code } = req.body;
    
    const userId = req.session.user.id;

    if (!userId || !code) {
        return res.status(400).json({ error: "User ID and code are required" });
    }

    const userModel = new User(db);
    const emailVerificationModel = new EmailVerification(db);
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const record = await emailVerificationModel.findByUserAndCode(user.id, code);
        if (!record) {
            return res.status(400).json({ error: "Invalid or expired code" });
        }

        await userModel.updateIsEmailConfirmed(userId);

        await emailVerificationModel.deleteById(record.id);

        // res.json({ message: "Email confirmed successfully" });
        const confirmedUser = await userModel.findById(userId);

        // возвращаем безопасные данные без password_hash
        const { password_hash, ...safeUser } = confirmedUser;

        res.json({
            message: "Email confirmed successfully",
            user: safeUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json('Server error');
    }
}

export default handleVerifyEmail;