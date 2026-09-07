const multer = require('multer');


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        // Keep multipart requests below Vercel's 4.5 MB function body limit.
        fileSize: 4 * 1024 * 1024,
    }
})

module.exports = upload;
