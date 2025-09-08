function requireAuth(req, res, next) {    
    if (req.session && req.session.user) {
        // пользователь авторизован, передаём управление дальше
        next();
    } else {
        // пользователь не авторизован
        res.status(401).json({ error: 'Unauthorized: please log in' });
    }
}

export default requireAuth;