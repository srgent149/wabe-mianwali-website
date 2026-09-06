const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = crypto.randomBytes(8).toString('hex');
    cb(null, `${Date.now()}-${unique}${ext}`);
  },
});

const allowedExt = new Set(['.jpg', '.jpeg', '.png', '.webp', '.pdf']);

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExt.has(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type.'));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
