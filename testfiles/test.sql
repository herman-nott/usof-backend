-- db test 1
USE usof_db;
-- SHOW TABLES;


-- db test 2
-- SHOW CREATE TABLE users;
-- SHOW CREATE TABLE posts;
-- SHOW CREATE TABLE post_categories;
-- SHOW CREATE TABLE comments;
-- SHOW CREATE TABLE likes;


-- db test 3
-- INSERT INTO users (login, password_hash, full_name, email, role)
-- VALUES ('admin', 'hashedpass', 'Admin User', 'admin@example.com', 'admin');

-- INSERT INTO categories (title, description)
-- VALUES ('Backend', 'All about server development'),
--        ('Frontend', 'All about frontend');

-- INSERT INTO posts (author_id, title, content, status)
-- VALUES (1, 'First post', 'This is test post', 'active');

-- INSERT INTO post_categories (post_id, category_id)
-- VALUES (1, 1), (1, 2);

-- INSERT INTO comments (post_id, author_id, content, status, parent_id)
-- VALUES (1, 1, 'First comment', 'active', NULL);

-- INSERT INTO likes (author_id, post_id, type)
-- VALUES (1, 1, 'like');


-- db test 4
-- SELECT p.title, c.title AS category
-- FROM posts p
-- JOIN post_categories pc ON p.id = pc.post_id
-- JOIN categories c ON pc.category_id = c.id;

-- SELECT u.login, c.content, c.status
-- FROM comments c
-- JOIN users u ON c.author_id = u.id
-- WHERE c.post_id = 1;

SELECT u.login, l.type
FROM likes l
JOIN users u ON l.author_id = u.id
WHERE l.post_id = 1;