function requireAdminOrSelf(req, res, next) {
    const sessionUser = req.session.user;
    const { user_id } = req.params;

    if (!sessionUser) {
        return res.status(401).json({ error: "Unauthorized: please log in" });
    }

    if (sessionUser.role !== "admin" && sessionUser.id != user_id) {
        return res.status(403).json({ error: "Forbidden" });
    }

    next();
}

export default requireAdminOrSelf;