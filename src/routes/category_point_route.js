const express = require('express');
const router = express.Router();
const categoryPointControllerr = require("../controllers/category_point_controller");
const multer = require('multer');
const path = require('path');
// Thiết lập nơi lưu trữ tệp tin tải lên
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/uploads/'); // Lưu tệp tin vào thư mục public/uploads
    },
    filename: function (req, file, cb) {
        // Tạo tên tệp tin mới bằng cách thêm dấu thời gian vào tên gốc
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname); // Lấy phần mở rộng của tệp tin
        cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Sử dụng tên tệp tin mới
    }
});

const upload = multer({ storage: storage });

router.get('/', categoryPointControllerr.getAllCategoryPoint);

router.get('/add', categoryPointControllerr.createCategoryPointIndex);

router.post('/add', upload.single('image'), categoryPointControllerr.createCategoryPoint);

router.get('/:id', categoryPointControllerr.getCategoryPointById);

router.post('/:id', upload.single('image'), categoryPointControllerr.updateCategoryPoint);

router.delete('/:id', categoryPointControllerr.deleteCategoryPoint);

module.exports = router;
