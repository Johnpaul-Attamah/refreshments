"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _multer = _interopRequireDefault(require("multer"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const storage = _multer.default.diskStorage({});

const fileFilter = (req, file, cb) => {
  let ext = _path.default.extname(file.originalname);

  if (ext === '.jpeg' || ext === '.png' || ext === '.jpg') {
    cb(null, true);
  } else {
    cb({
      message: 'Unsupported File Format'
    }, false);
  }
};

const upload = (0, _multer.default)({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 8
  },
  fileFilter
});
var _default = upload;
exports.default = _default;