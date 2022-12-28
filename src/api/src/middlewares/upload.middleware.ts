import createError from '@/utils/helpers/createError';
import multer from 'multer';
import path from 'path';

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './client/public/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fullname = 'img-' + uniqueSuffix + path.extname(file.originalname);
    if (!['image/png', 'image/jpeg'].includes(file.mimetype))
      cb(
        createError.BadRequest('You can only upload .png or .jpg files'),
        fullname
      );
    else cb(null, fullname);
  },
});

export const uploadMiddleware = multer({
  storage: storage,
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE) },
}).single('file');
