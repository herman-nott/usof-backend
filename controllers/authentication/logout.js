function handleLogout(req, res) {
    if (!req.session || !req.session.user.id) {
        // нет активной сессии — ошибка
        return res.status(400).json({ error: 'No active session, cannot logout' });
    }

    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); // очищаем куку
        res.json({ message: 'Logged out successfully' });
    });
}

export default handleLogout;