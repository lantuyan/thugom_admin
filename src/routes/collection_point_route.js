const express = require('express');
const router = express.Router();
const collectionPointController = require("../controllers/collection_point_controller");

// Route để lấy tất cả các bins
router.get('/', collectionPointController.getAllCollectionPoint);

// Route để tạo một bin mới
router.get('/add', collectionPointController.createCollectionPointIndex);
// Route để tạo một bin mới
router.post('/add', collectionPointController.createCollectionPoint);

// Route để lấy một bin dựa trên ID
router.get('/update/:id', collectionPointController.getCollectionPointById);

// Route để cập nhật một bin
router.post('/update/:id', collectionPointController.updateCollectionPoint);

// Route để xóa một bin
router.delete('/:id', collectionPointController.deleteCollectionPoint);
module.exports = router;
