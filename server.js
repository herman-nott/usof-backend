// import libs
import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import session from "express-session";
import crypto from "crypto";
import nodemailer from "nodemailer";

// database
import db from "./db.js";

// .env
import 'dotenv/config';

// controllers
// ~~~ Authentication ~~~
import handleRegister from "./controllers/authentication/register.js";
import handleLogin from "./controllers/authentication/login.js";
import handleLogout from "./controllers/authentication/logout.js";
import handlePasswordReset from "./controllers/authentication/passwordReset.js";
import handlePasswordResetConfirm from "./controllers/authentication/passwordResetConfirm.js";
import handleVerifyEmail from "./controllers/authentication/verifyEmail.js";
// ~~~ User ~~~
import handleGetAllUsers from "./controllers/user/getAllUsers.js";
import handleGetUserById from "./controllers/user/getUserById.js";
import handleCreateUser from "./controllers/user/createUser.js";
import handleUpdateAvatar from "./controllers/user/updateAvatar.js";
import handleUpdateUser from "./controllers/user/updateUser.js";
import handleDeleteUser from "./controllers/user/deleteUser.js";
// ~~~ Post ~~~
import handleGetAllPosts from "./controllers/post/getAllPosts.js";
import handleGetPostById from "./controllers/post/getPostById.js";
import handleGetCommentsByPostId from "./controllers/post/getCommentsByPostId.js";
import handleCreateComment from "./controllers/post/createComment.js";
import handleGetCategoriesByPostId from "./controllers/post/getCategoriesByPostId.js";
import handleGetLikesByPostId from "./controllers/post/getLikesByPostId.js";
import handleCreatePost from "./controllers/post/createPost.js";
import handleCreateLikeForPost from "./controllers/post/createLikeForPost.js";
import handleUpdatePost from "./controllers/post/updatePost.js";
import handleDeletePost from "./controllers/post/deletePost.js";
import handleDeleteLikeFromPost from "./controllers/post/deleteLikeFromPost.js";

// middleware
import requireAuth from "./middleware/requireAuth.js";
import requireAdmin from "./middleware/requireAdmin.js";
import upload from "./middleware/uploadAvatar.js";
import requireAdminOrSelf from "./middleware/requireAdminOrSelf.js";
import requirePostAuthorOrAdmin from "./middleware/requirePostAuthorOrAdmin.js";
import requireEmailConfirmed from "./middleware/requireEmailConfirmed.js";

// adminjs
import AdminJS from 'adminjs';
import Plugin from '@adminjs/express';
import { Adapter, Database, Resource } from '@adminjs/sql';

AdminJS.registerAdapter({
    Database,
    Resource,
});

async function start() {
    const app = express();
    const PORT = 3000;
    
    const database = await new Adapter('mysql2', {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    }).init();

    const admin = new AdminJS({
        resources: [
            { resource: database.table('users') },
            { resource: database.table('posts') },
            { resource: database.table('categories') },
            // { resource: database.table('post_categories') },
            { resource: database.table('comments') },
            { resource: database.table('likes') },
            { resource: database.table('password_resets') },
            { resource: database.table('email_verifications') },
        ],
    });

    admin.watch();

    const router = Plugin.buildRouter(admin);

    app.use(admin.options.rootPath, router);
    app.use(bodyParser.json());
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,                        // не сохранять сессию, если она не изменена
        saveUninitialized: false,             // не создавать сессию до первого использования
        cookie: { secure: false }             // для разработки secure: false, в проде с HTTPS нужно secure: true
    }));
    app.use("/uploads", express.static("uploads"));


    // === GET Requests ===
    app.get('/', (req, res) => {    
        res.send('getting root');
    });
    app.get('/api/users', (req, res) => { handleGetAllUsers(req, res, db) });
    app.get('/api/users/:user_id', (req, res) => { handleGetUserById(req, res, db) });
    app.get('/api/posts', (req, res) => { handleGetAllPosts(req, res, db) });
    app.get('/api/posts/:post_id', (req, res) => { handleGetPostById(req, res, db) });
    app.get('/api/posts/:post_id/comments', (req, res) => { handleGetCommentsByPostId(req, res, db) });
    app.get('/api/posts/:post_id/categories', (req, res) => { handleGetCategoriesByPostId(req, res, db) });
    app.get('/api/posts/:post_id/like', (req, res) => { handleGetLikesByPostId(req, res, db) });

    // === POST Requests ===
    app.post('/api/auth/register', (req, res) => { handleRegister(req, res, db, bcrypt, nodemailer) });
    app.post('/api/auth/login', requireEmailConfirmed, (req, res) => { handleLogin(req, res, db, bcrypt) });
    app.post('/api/auth/logout', requireAuth, (req, res) => { handleLogout(req, res) });
    app.post('/api/auth/password-reset', (req, res) => { handlePasswordReset(req, res, db, crypto, nodemailer) });
    app.post('/api/auth/password-reset/:confirm_token', (req, res) => { handlePasswordResetConfirm(req, res, db, bcrypt, crypto) });
    app.post('/api/users', requireAdmin, (req, res) => { handleCreateUser(req, res, db, bcrypt) });
    app.post('/api/posts/:post_id/comments', requireAuth, (req, res) => { handleCreateComment(req, res, db) });
    app.post('/api/posts/', requireAuth, (req, res) => { handleCreatePost(req, res, db) });
    app.post('/api/posts/:post_id/like', requireAuth, (req, res) => { handleCreateLikeForPost(req, res, db) });
    app.post('/api/auth/register/verify-email', (req, res) => { handleVerifyEmail(req, res, db) });

    // === PATCH Requests ===
    app.patch('/api/users/avatar', requireAuth, upload.single('avatar'), (req, res) => { handleUpdateAvatar(req, res, db) });
    app.patch('/api/users/:user_id', requireAuth, requireAdminOrSelf, (req, res) => { handleUpdateUser(req, res, db) });
    app.patch('/api/posts/:post_id', requireAuth, (req, res) => { handleUpdatePost(req, res, db) });

    // === DELETE Requests ===
    app.delete('/api/users/:user_id', requireAuth, requireAdminOrSelf, (req, res) => { handleDeleteUser(req, res, db) });
    app.delete('/api/posts/:post_id', requireAuth, requirePostAuthorOrAdmin, (req, res) => { handleDeletePost(req, res, db) });
    app.delete('/api/posts/:post_id/like', requireAuth, (req, res) => { handleDeleteLikeFromPost(req, res, db) });

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

start();
