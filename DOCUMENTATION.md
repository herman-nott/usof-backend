# USOF Backend — DOCUMENTATION.md

1. [Short Description](#short-description)
2. [Current Status and Progress per CBL Stages](#current-status-and-progress-per-cbl-stages)
   - Engage
   - Investigate
   - Act
3. [Project Architecture and Algorithm](#project-architecture-and-algorithm)
4. [Database Schema and Relationships](#database-schema-and-relationships)
5. [Installation and Running](#installation-and-running)
6. [Environment Variables](#environment-variables)
7. [API Endpoints](#api-endpoints-summary)
8. [Example Requests and Responses](#example-requests-and-responses)
9. [Admin Panel (AdminJS)](#admin-panel-adminjs)

---

## Short Description

USOF is a RESTful API for a forum-like application with user management, posts, comments, categories, likes, and roles (admin / user). The project is built using Node.js + Express and uses MySQL (mysql2) as the database. The admin interface is implemented with AdminJS.

Key features:
- User registration, email verification, and password reset
- Authorization and session management
- CRUD operations for users, posts, categories, and comments
- Likes for posts and comments
- Lock/unlock posts and comments
- Avatar uploads
- Role-based access (admin, author, user)

---

## Current Status and Progress per CBL Stages

### Engage
**Goal:** define requirements, target audience, and use cases.
**Done:**
- Scope defined: forum with roles and basic moderation.
- Requirements collected: registration/login, post creation, comments, likes, categories, admin panel.
- Initial README and server skeleton (routes, controllers, middleware) created.

**Result:** prioritized feature list (auth → admin → posts → categories → comments).

--- 

### Investigate
**Goal:** choose technologies, design DB, API, and architecture.
**Done:**
- Tech stack chosen: Node.js, Express, MySQL (mysql2), Knex (optional), AdminJS for admin.
- Database schema designed (users, posts, categories, post_categories, comments, likes, password_resets, email_verifications).
- Email verification and password reset flows designed (tokens, tables with expiration).
- Middlewares identified: requireAuth, requireAdmin, requireAdminOrSelf, requirePostAuthorOrAdmin, requireEmailConfirmed, requireOwnLike.

**Result:** detailed DB schema and API endpoints; migrations and initial SQL scripts prepared.

---

### Act
**Goal:** implement features step by step, test, and document.
**Done:**
- Core routes and controllers implemented (handlers imported in `server.js`).
- Middleware templates implemented and AdminJS integrated.
- Avatar upload implemented via multer and served from `/uploads`.
- Email skeleton (nodemailer) and password tokens implemented.

**Remaining:**
- Complete any missing controllers in `controllers/`
- Full migrations/seed scripts
- End-to-end testing

---

## Project Architecture and Algorithm

### Folder Structure
```
root/
├─ controllers/           # business logic for each entity
│  ├─ authentication/
│  ├─ user/
│  ├─ post/
│  ├─ comments/
│  └─ categories/
├─ middleware/            # auth checks, role checks, uploads
├─ models/                # models for working with a database
├─ uploads/               # media storage
│  └─ avatars/            # avatars storage
├─ admin/                 # AdminJS configuration
├─ db.js                  # database connection (mysql2/knex)
├─ server.js              # entry point (start function)
└─ .env
```

### Request Flow Example (POST /api/posts)
1. Client sends `POST /api/posts` with session cookie or token.
2. `requireAuth` middleware checks the session.
3. `handleCreatePost` controller validates input (title, body, categories).
4. Post is created in `posts` table; `post_categories` created if categories provided.
5. Returns the created post with HTTP 201.

### Authorization and Sessions
- Uses `express-session`. After login, `req.session.userId` is stored.
- `requireAuth` middleware checks session and user.

### Email Verification and Password Reset
- On registration, a record is created in `email_verifications` with token and expiration.
- Verification email sent; clicking the link calls `POST /api/auth/register/verify-email`.
- Password reset request creates a record in `password_resets` and sends email with `confirm_token`.

---

## Database Schema and Relationships

### Basic tables

#### 1. users

Stores user data.

- id
- login
- password_hash
- full_name
- email
- profile_picture
- rating
- role
- created_at
- updated_at
- is_email_confirmed

| Field                 | Type                                                              | Description                                 |
|-----------------------|-------------------------------------------------------------------|---------------------------------------------|
| `id`                  | INT PK                                                            | Unique ID                                   |
| `login`               | VARCHAR(50)                                                       | Login (nickname)                            |
| `password_hash`       | VARCHAR(255)                                                      | Hashed password                             |
| `full_name`           | VARCHAR(100)                                                      | Full name                                   |
| `email`               | VARCHAR(100)                                                      | E-mail                                      |
| `profile_picture`     | VARCHAR(255)                                                      | Profile picture URL                         |
| `rating`              | INT DEFAULT 0                                                     | Likes - Dislikes (automatic recalculation)  |
| `role`                | ENUM('user','admin') DEFAULT 'user'                               | Rights                                      |
| `created_at`          | TIMESTAMP DEFAULT CURRENT_TIMESTAMP                               | Profile creation date                       |
| `updated_at`          | TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP   | Profile change date                         |
| `is_email_confirmed`  | BOOLEAN DEFAULT FALSE                                             | Profile change date                         |

---

#### 2. posts

Information about all posts.

- id
- author_id
- title
- publish_date
- status
- content
- created_at
- updated_at

| Field              | Type                                                              | Description                           |
|--------------------|-------------------------------------------------------------------|---------------------------------------|
| `id`               | INT PK                                                            | Unique ID                             |
| `author_id`        | INT FK →  users.id                                                | Who has created                       |
| `title`            | VARCHAR(150)                                                      | Publication title                     |
| `publish_date `    | TIMESTAMP DEFAULT CURRENT_TIMESTAMP                               | Publication date                      |
| `status`           | ENUM('active','inactive') DEFAULT 'active'                        | Visibility                            |
| `content`          | TEXT                                                              | Description of the problem/solution   |
| `created_at`       | TIMESTAMP DEFAULT CURRENT_TIMESTAMP                               | Publication creation date             |
| `updated_at`       | TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP   | Publication change date               |

---

#### 3. categories

Information about post categories.

- id
- title
- description

| Field           | Type                                 | Description                  |
|-----------------|--------------------------------------|------------------------------|
| `id`            | INT PK                               | Unique ID                    |
| `title`         | VARCHAR(100)                         | Category title               |
| `description`   | VARCHAR(255)                         | Category description         |

---

#### 4. comments

Stores all omments to the post.

- id
- post_id
- author_id
- content
- publish_date
- status
- parent_id

| Field           | Type                                        | Description                   |
|-----------------|---------------------------------------------|-------------------------------|
| `id`            | INT PK                                      | Unique ID                     |
| `post_id`       | INT FK →  posts.id                          | What post does it belong to   |
| `author_id`     | INT FK →  users.id                          | Who wrote                     |
| `content`       | TEXT                                        | Comment text                  |
| `publish_date`  | TIMESTAMP DEFAULT CURRENT_TIMESTAMP         | Comment creation date         |
| `status`        | ENUM('active','inactive') DEFAULT 'active'  | Comment status                |
| `parent_id`     | INT FK →  comments.id, NULL                 | For nested comments           |

---

#### 5. likes

Associates likes of post or comment.

- id
- author_id
- post_id
- comment_id
- type
- publish_date
- **UNIQUE (author_id, post_id, comment_id)** *-> guarantees that one user can only put one like/dislike under one entity*

| Field            | Type                           | Description          |
|------------------|--------------------------------|----------------------|
| `id`             | INT PK                         | Unique ID            |
| `author_id`      | INT FK →  users.id             | Who liked            |
| `post_id`        | INT FK →  posts.id, NULL       | Like to the post     |
| `comment_id`     | INT FK →  comments.id, NULL    | Like to the comment  |
| `type`           | ENUM('like','dislike')         | Like or dislike      |
| `publish_date`   | INT FK →  comments.id, NULL    | Like date            |



### Additional tables

#### 1. post_categories

Relationship between posts and categories.

- post_id
- category_id
- **PRIMARY KEY (post_id, category_id)**

| Field            | Type                           | Description        |
|------------------|--------------------------------|--------------------|
| `post_id`        | INT FK → posts.id              | Post ID            |
| `category_id`    | INT FK → categories.id         | Category liked     |

#### 2. password_resets

Stores password reset requests

- id
- user_id
- token_hash
- expires_at
- used

| Field          | Type                        | Description                       |
|----------------|-----------------------------|-----------------------------------|
| `id`           | INT AUTO_INCREMENT          | Primary key                       |
| `user_id`      | INT FK → users.id           | ID of the user requesting reset   |
| `token_hash`   | VARCHAR(255)                | Hashed reset token                |
| `expires_at`   | DATETIME                    | Token expiration datetime         |
| `used`         | BOOLEAN                     | Whether the token has been used   |

#### 3. email_verifications

Stores email verification codes for users.

- id
- user_id
- code
- created_at
- expires_at

| Field        | Type                                | Description                         |
|--------------|-------------------------------------|-------------------------------------|
| `id`         | INT AUTO_INCREMENT                  | Primary key                         |
| `user_id`    | INT FK → users.id                   | ID of the user being verified       |
| `code`       | CHAR(6)                             | Verification code                   |
| `created_at` | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | When the code was created           |
| `expires_at` | TIMESTAMP                           | When the code expires               |


### Connections

- users 1 — M posts
- users 1 — M comments
- users 1 — M likes
- posts 1 — M comments
- posts M — M categories (with post_categories)
- posts 1 — M likes
- comments 1 — M likes

*1 — M (one-to-many)   → one record in one table can be related to several records in another*  

*M — M (many-to-many)  → multiple records in one table can be related to multiple records in another*

---

## Installation and Running

1. Clone the repository
```bash
git clone <repo>
cd <repo>
```
2. Install dependencies
```bash
npm install
```
3. Create `.env` (see below) and set up database
4. Run the server
```bash
npm start
# or
node server.js
```
5. Admin panel available at `http://localhost:3000/admin` (if PORT=3000)

---

## Environment Variables

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

--- 

## API Endpoints (summary)

### Authentication
- `POST /api/auth/register` — register
- `POST /api/auth/login` — login (email must be confirmed)
- `POST /api/auth/logout` — logout
- `POST /api/auth/password-reset` — request password reset
- `POST /api/auth/password-reset/:token` — confirm new password
- `POST /api/auth/register/verify-email` — verify email

### Users
- `GET /api/users` — all users
- `GET /api/users/:id` — get user by ID
- `POST /api/users` — create user (admin only)
- `PATCH /api/users/:id` — update (admin or self)
- `PATCH /api/users/avatar` — upload avatar (multipart/form-data)
- `DELETE /api/users/:id` — delete (admin or self)

### Posts
- `GET /api/posts` — list posts (pagination)
  - query params: `page`, `limit`, `sort`, `order`, filters (category, author, search)
- `GET /api/posts/:id` — get post
- `POST /api/posts` — create post (auth)
- `PATCH /api/posts/:id` — update (author/admin)
- `DELETE /api/posts/:id` — delete (author/admin)
- `POST /api/posts/:id/like` — like post
- `DELETE /api/posts/:id/like` — remove own like
- `PATCH /api/posts/:id/lock` — lock post
- `PATCH /api/posts/:id/unlock` — unlock post

### Categories
- `GET /api/categories`
- `GET /api/categories/:id`
- `GET /api/categories/:id/posts` — get posts of category
- `POST /api/categories` — create category
- `PATCH /api/categories/:id` — update category
- `DELETE /api/categories/:id` — delete category

### Comments
- `GET /api/posts/:id/comments`
- `GET /api/comments/:id`
- `POST /api/posts/:id/comments` — create comment
- `PATCH /api/comments/:id` — update comment
- `DELETE /api/comments/:id` — delete comment
- `POST /api/comments/:id/like` — like comment
- `DELETE /api/comments/:id/like` — remove like

---

## Example Requests and Responses

### Example: Registration
**Request**
```
POST /api/auth/register
Content-Type: application/json
{
   "login": "john",
   "password": "123",
   "password_confirmation": "123",
   "firstname": "John",
   "lastname": "Snow",
   "email": "john_snow@gmail.com"
}
```
**Response**
```
201 Created
{ "message": "Please confirm your email using the 6-digit code sent to you." }
```

### Example: Create Post
**Request**
```
POST /api/posts
Content-Type: application/json
{
  "title": "My First Post",
  "body": "Post content",
  "categories": [1, 3]
}
```
**Response**
```
201 Created
{
    "id": 12,
    "author_id": 17,
    "title": "My First Post",
    "publish_date": "2025-09-18T12:32:14.000Z",
    "status": "active",
    "content": "Post content",
    "created_at": "2025-09-18T12:32:14.000Z",
    "updated_at": "2025-09-18T12:32:14.000Z",
    "categories": [
        {
            "id": 1,
            "title": "Cateroty 1",
            "description": "Cateroty 1 Description"
        },
        {
            "id": 3,
            "title": "Cateroty 3",
            "description": "Cateroty 3 Description"
        }
    ]
}
```

---

## Admin Panel (AdminJS)
- AdminJS connected to tables: users, posts, categories, comments, likes, password_resets, email_verifications.
- `admin/userResource.js` allows customizing actions/fields and visibility.
- For development, run `admin.watch()` (enabled in server.js) to reload AdminJS on changes.

---

## Conclusion
This document serves as a full documentation base for USOF, describing CBL progress, architecture, and key algorithms. 

--- 

*Author: Herman Pohosian*