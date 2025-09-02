const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');

// database
const db = require('./db');

// .env
require('dotenv').config();

// import controllers
const register = require('./controllers/authentication/register');
const login = require('./controllers/authentication/login');
const logout = require('./controllers/authentication/logout');

// import middleware
// const requireAuth = require('./middleware/requireAuth');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,                        // не сохранять сессию, если она не изменена
    saveUninitialized: false,             // не создавать сессию до первого использования
    cookie: { secure: false }             // для разработки secure: false, в проде с HTTPS нужно secure: true
}));


// === GET Requests ===
app.get('/', (req, res) => {    
    // res.send('getting root');
    res.send(database.users);
});

// === POST Requests ===
app.post('/api/auth/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.post('/api/auth/login', (req, res) => { login.handleLogin(req, res, db, bcrypt) });
app.post('/api/auth/logout', (req, res) => { logout.handleLogout(req, res) });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
