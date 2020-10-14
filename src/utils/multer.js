import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  let ext = path.extname(file.originalname);
  if (ext === '.jpeg' || ext === '.png' || ext === '.jpg') {
    cb(null, true);
  } else {
    cb({
      message: 'Unsupported File Format',
    }, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 8,
  },
  fileFilter,
});

export default upload;
