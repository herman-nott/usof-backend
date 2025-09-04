function handleLogout(req, res) {
    if (!req.session || !req.session.userId) {
        // нет активной сессии — ошибка
        return res.status(400).json({ message: 'No active session, cannot logout' });
    }

    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); // очищаем куку
        res.json({ message: 'Logged out successfully' });
    });
}

export default handleLogout;