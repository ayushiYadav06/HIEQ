const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'general';
    
    // Determine folder based on field name
    if (file.fieldname === 'aadhar') {
      folder = 'aadhar';
    } else if (file.fieldname === 'degreeFile') {
      folder = 'education';
    } else if (file.fieldname === 'profileImage') {
      folder = 'profile';
    }
    
    const folderPath = path.join(uploadDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, .png, and .pdf files are allowed!'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Middleware for user form uploads (multiple files)
const uploadUserFiles = upload.fields([
  { name: 'aadhar', maxCount: 10 }, // Allow multiple aadhar files
  { name: 'degreeFile', maxCount: 10 }, // Multiple education certificates
  { name: 'profileImage', maxCount: 1 }
]);

module.exports = {
  upload,
  uploadUserFiles
};

