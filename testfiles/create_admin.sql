INSERT INTO users (
    login,
    password_hash,
    full_name,
    email,
    profile_picture,
    rating,
    role,
    created_at,
    updated_at,
    is_email_confirmed
) VALUES (
    'admin',
    '$2b$10$FcUQyXqPRieIEVMQFWQ2/OEoZuhXB7Zj1PyK7Wkbx13R2w/iyEGv.', -- это хеш пароля "123456"
    'Herman Pohosian',
    'mcgerman2006@gmail.com',
    'default.png',
    0,
    'admin',
    NOW(),
    NOW(),
    1
);
