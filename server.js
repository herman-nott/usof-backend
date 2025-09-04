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


// import middleware
// const requireAuth = require('./middleware/requireAuth');

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


    // === GET Requests ===
    app.get('/', (req, res) => {    
        res.send('getting root');
    });

    // === POST Requests ===
    app.post('/api/auth/register', (req, res) => { handleRegister(req, res, db, bcrypt) });
    app.post('/api/auth/login', (req, res) => { handleLogin(req, res, db, bcrypt) });
    app.post('/api/auth/logout', (req, res) => { handleLogout(req, res) });
    app.post('/api/auth/password-reset', (req, res) => { handlePasswordReset(req, res, db, crypto, nodemailer) });
    app.post('/api/auth/password-reset/:confirm_token', (req, res) => { handlePasswordResetConfirm(req, res, db, bcrypt, crypto) });

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

start();
