CREATE DATABASE IF NOT EXISTS usof_db;
CREATE USER IF NOT EXISTS 'hpohosian'@'localhost' IDENTIFIED BY 'securepass';
GRANT ALL PRIVILEGES ON usof_db.* TO 'hpohosian'@'localhost';