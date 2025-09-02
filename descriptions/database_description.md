# Database description

## Basic tables

### 1. users

Stores user data

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

### 2. posts

Information about all posts

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
| `author_id`        | INT FK -> users.id                                                | Who has created                       |
| `title`            | VARCHAR(150)                                                      | Publication title                     |
| `publish_date `    | TIMESTAMP DEFAULT CURRENT_TIMESTAMP                               | Publication date                      |
| `status`           | ENUM('active','inactive') DEFAULT 'active'                        | Visibility                            |
| `content`          | TEXT                                                              | Description of the problem/solution   |
| `created_at`       | TIMESTAMP DEFAULT CURRENT_TIMESTAMP                               | Publication creation date             |
| `updated_at`       | TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP   | Publication change date               |

---

### 3. categories

Information about post categories

- id
- title
- description

| Field           | Type                                 | Description                  |
|-----------------|--------------------------------------|------------------------------|
| `id`            | INT PK                               | Unique ID                    |
| `title`         | VARCHAR(100)                         | Category title               |
| `description`   | VARCHAR(255)                         | Category description         |

---

### 4. comments

Stores all omments to the post

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
| `post_id`       | INT FK -> posts.id                          | What post does it belong to   |
| `author_id`     | INT FK -> users.id                          | Who wrote                     |
| `content`       | TEXT                                        | Comment text                  |
| `publish_date`  | TIMESTAMP DEFAULT CURRENT_TIMESTAMP         | Comment creation date         |
| `status`        | ENUM('active','inactive') DEFAULT 'active'  | Comment status                |
| `parent_id`     | INT FK -> comments.id, NULL                 | For nested comments           |

---

### 5. likes

Associates likes of post or comment

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
| `author_id`      | INT FK -> users.id             | Who liked            |
| `post_id`        | INT FK -> posts.id, NULL       | Like to the post     |
| `comment_id`     | INT FK -> comments.id, NULL    | Like to the comment  |
| `type`           | ENUM('like','dislike')         | Like or dislike      |
| `publish_date`   | INT FK -> comments.id, NULL    | Like date            |



## Additional tables

### 1. post_categories

Relationship between posts and categories

- post_id
- category_id
- **PRIMARY KEY (post_id, category_id)**

| Field            | Type                           | Description        |
|------------------|--------------------------------|--------------------|
| `post_id`        | INT FK → posts.id              | Post ID            |
| `category_id`    | INT FK -> categories.id        | Category liked     |



## Connections

- users 1 — M posts
- users 1 — M comments
- users 1 — M likes
- posts 1 — M comments
- posts M — M categories (через post_categories)
- posts 1 — M likes
- comments 1 — M likes

*1 — M (one-to-many)   -> one record in one table can be related to several records in another*


*M — M (many-to-many)  -> multiple records in one table can be related to multiple records in another*