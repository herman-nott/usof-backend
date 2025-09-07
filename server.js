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

// import controllers
// ~~~ Authentication ~~~
import handleRegister from "./controllers/authentication/register.js";
import handleLogin from "./controllers/authentication/login.js";
import handleLogout from "./controllers/authentication/logout.js";
import handlePasswordReset from "./controllers/authentication/password_reset.js";
import handlePasswordResetConfirm from "./controllers/authentication/password_reset_confirm.js";
// ~~~ User ~~~
import handleGetAllUsers from "./controllers/user/getAllUsers.js";
import handleGetUserById from "./controllers/user/getUserById.js";
import handleCreateUser from "./controllers/user/createUser.js";
import handleUpdateAvatar from "./controllers/user/updateAvatar.js";

// import middleware
import requireAuth from "./middleware/requireAuth.js";
import requireAdmin from "./middleware/requireAdmin.js";
import upload from "./middleware/uploadAvatar.js";

import AdminJS from 'adminjs'
import Plugin from '@adminjs/express'
import { Adapter, Database, Resource } from '@adminjs/sql'

AdminJS.registerAdapter({
    Database,
    Resource,
})

async function start() {
    const app = express();
    const PORT = 3000;
    
    const database = await new Adapter('mysql2', {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: 'ger06man',
        database: 'usof_db',
    }).init();

    const admin = new AdminJS({
        resources: [
            { resource: database.table('users') },
            { resource: database.table('posts') },
            { resource: database.table('categories') },
            { resource: database.table('post_categories') },
            { resource: database.table('comments') },
            { resource: database.table('likes') },
            { resource: database.table('password_resets') },
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

    // === POST Requests ===
    app.post('/api/auth/register', (req, res) => { handleRegister(req, res, db, bcrypt) });
    app.post('/api/auth/login', (req, res) => { handleLogin(req, res, db, bcrypt) });
    app.post('/api/auth/logout', requireAuth, (req, res) => { handleLogout(req, res) });
    app.post('/api/auth/password-reset', (req, res) => { handlePasswordReset(req, res, db, crypto, nodemailer) });
    app.post('/api/auth/password-reset/:confirm_token', (req, res) => { handlePasswordResetConfirm(req, res, db, bcrypt, crypto) });
    app.post('/api/users', requireAdmin, (req, res) => { handleCreateUser(req, res, db, bcrypt) });

    // === PATCH Requests ===
    app.patch('/api/users/avatar', requireAuth, upload.single('avatar'), (req, res) => { handleUpdateAvatar(req, res, db) });

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

start();
