import multer from "multer";
import path from "path";

// хранилище файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/avatars"); // папка для сохранения аватаров
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = req.session.user.id + "_" + Date.now() + ext; 
        // имя файла: id пользователя + текущее время + расширение
        cb(null, uniqueName);
    }
});

// фильтрация файлов (только изображения)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) { 
        cb(null, true); 
    } else {
        cb(new Error("Only images are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter });

export default upload;