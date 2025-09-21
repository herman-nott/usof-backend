# USOF Project – Forum API with Admin Panel

## 📌 Short Description
This project is a **RESTful API** built with **Node.js, Express, and MySQL**.  
It implements a forum-like system with authentication, user management, posts, categories, comments, likes, and an **AdminJS** dashboard for administrators.  

The API supports:
- User registration, login, logout, password reset, and email verification  
- CRUD operations for users, posts, categories, and comments  
- Likes for posts and comments  
- Locking/unlocking posts and comments  
- Role-based access control (admin, author, authenticated user)  
- File upload for avatars  

---

## ⚙️ Requirements and Dependencies

### Requirements
- [Node.js](https://nodejs.org/) (>= 18.x)
- [MySQL](https://www.mysql.com/) (>= 8.0)

### Dependencies
The main npm packages used in the project:
- **express** – Web framework  
- **mysql2** – Database driver  
- **knex** – Query builder (if used in your db.js)  
- **bcrypt** – Password hashing  
- **express-session** – Session handling  
- **crypto** – Token generation  
- **nodemailer** – Sending emails  
- **multer** – File uploads (avatars)  
- **dotenv** – Environment configuration  
- **adminjs**, **@adminjs/express**, **@adminjs/sql** – Admin panel  

---

## 🚀 How to Run the Project

1. **Clone the repository**
   ```bash
   git clone [https://github.com/herman-nott/usof-backend.git](https://github.com/herman-nott/usof-backend.git)
   ```
   
   ```bash
   cd usof-backend
   ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Configure environment variables**  
Create a .env file in the root folder with your database and session credentials:
    ```.env
    # Secret for user sessions (use any long random string)
    SESSION_SECRET=yourSecretKeyHere

    # URL of your frontend application
    FRONTEND_URL=http://localhost:3000

    # Database configuration
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_USER=yourDbUser
    DB_PASSWORD=yourDbPassword
    DB_NAME=usof_db

    # SMTP (email) configuration
    SMTP_HOST=smtp.yourmailprovider.com
    SMTP_PORT=465
    SMTP_SECURE=true
    SMTP_USER=yourEmail@example.com
    SMTP_PASS=yourAppPasswordOrToken
    FROM_EMAIL=yourEmail@example.com
    ```

4. **Run the server**
    ```bash
    npm start
    ```
    The server will run on:  
    ```bash
    http://localhost:3000
    ```

5. **Access AdminJS panel**  
Navigate to:
    ```bash
    http://localhost:3000/admin
    ```

---

## 📖 API Overview

### Authentication module
- ```POST /api/auth/register``` – Register new user
- ```POST /api/auth/login``` – Login (email must be confirmed)
- ```POST /api/auth/logout``` – Logout
- ```POST /api/auth/password-reset``` – Request password reset
- ```POST /api/auth/password-reset/:token``` – Confirm password reset
- ```POST /api/auth/register/verify-email``` – Verify email

### User module
- ```GET /api/users``` – Get all users
- ```GET /api/users/:id``` – Get user by ID
- ```POST /api/users``` – Create user (admin only)
- ```PATCH /api/users/:id``` – Update user (admin or self)
- ```PATCH /api/users/avatar``` – Upload avatar
- ```DELETE /api/users/:id``` – Delete user (admin or self)

### Post module
- ```GET /api/posts``` – Get all posts (with pagination)
- ```GET /api/posts/:id``` – Get post by ID
- ```POST /api/posts``` – Create new post (auth required)
- ```PATCH /api/posts/:id``` – Update post (author or admin)
- ```DELETE /api/posts/:id``` – Delete post (author or admin)
- ```PATCH /api/posts/:id/lock``` – Lock post (author or admin)
- ```PATCH /api/posts/:id/unlock``` – Unlock post (author or admin)
- ```POST /api/posts/:id/like``` – Like post
- ```DELETE /api/posts/:id/like``` – Remove like

### Categories module
- ```GET /api/categories``` – Get all categories
- ```GET /api/categories/:id``` – Get category by ID
- ```GET /api/categories/:id/posts``` – Get posts by category
- ```POST /api/categories``` – Create category
- ```PATCH /api/categories/:id``` – Update category
- ```DELETE /api/categories/:id``` – Delete category

### Comments module
- ```GET /api/posts/:id/comments``` – Get comments for a post
- ```GET /api/comments/:id``` – Get comment by ID
- ```POST /api/posts/:id/comments``` – Create comment
- ```PATCH /api/comments/:id``` – Update comment
- ```DELETE /api/comments/:id``` – Delete comment
- ```PATCH /api/comments/:id/lock``` – Lock comment (author or admin)
- ```PATCH /api/comments/:id/unlock``` – Unlock comment (author or admin)
- ```POST /api/comments/:id/like``` – Like comment
- ```DELETE /api/comments/:id/like``` – Remove like

---

## 📝 Documentation
For detailed documentation, see [DOCUMENTATION.md]().  

It contains:
- Challenge Based Learning (CBL) stage reflections: Engage, Investigate, Act
- Algorithm description of the whole program
- Database schema and relations
- Example requests & responses