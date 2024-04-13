const { databases, storage } = require('../services/appwrite_server');
const sdk = require("node-appwrite");
const moment = require('moment');
const fs = require('fs');
class CategoryPointController {

    async getAllCategoryPoint(req, res) {
        try {
            const promise = await databases.listDocuments(
                process.env.APPWRITE_DB,
                process.env.APPWRITE_CATEGORY_POINT_COLLECTION,
                [
                    sdk.Query.limit(200),
                    sdk.Query.offset(0),
                    sdk.Query.orderAsc("$createdAt"),
                ]
            );
            promise.documents.forEach(item => {
                item.$createdAt = moment(item.$createdAt).format("DD-MM-YYYY");
                    // Đếm số lượng collectionPoints trong mỗi item
                item.collectionPointsCount = item.collectionPoints.length;
            });
            res.render('category_point/index', { title: "Loại địa điểm", categoryPoints: promise.documents});
        } catch (error) {
            console.log(error);
            res.status(500).send(error.message);
        }
    }
    async createCategoryPointIndex(req, res) {
        try {
            res.render('category_point/add', { title: "Thêm loại địa điểm"});
        } catch (error) {
            res.status(500).send(error);
        }
    }
    async createCategoryPoint(req, res) {
        const filePath = await req.file['path'];
        const fileName = await req.file['filename'];
        // res.json(filePath+fileName);
        const storageImage = storage.createFile(process.env.APPWRITE_CATEGORY_POINT_BUCKET, sdk.ID.unique(), sdk.InputFile.fromPath(filePath, fileName));
        storageImage.then(function (imageInfo) {
            // Nếu việc tải ảnh lên thành công, tiếp tục để tạo tài liệu
            const imageUrl = `${process.env.APPWRITE_URL}/storage/buckets/${process.env.APPWRITE_CATEGORY_POINT_BUCKET}/files/${imageInfo.$id}/view?project=${process.env.APPWRITE_PROJECT}`;
            const document = databases.createDocument(
                process.env.APPWRITE_DB,
                process.env.APPWRITE_CATEGORY_POINT_COLLECTION,
                sdk.ID.unique(),
                {
                    Label: getFirstLettersOfEachWord(req.body['label']),
                    full_label: req.body['label'],
                    Icon: imageUrl, 
                }
            );
            document.then(
                function (response) {
                    fs.unlink(req.file.path, (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                            return;
                        }
                        console.log('File deleted successfully');
                    });
                    res.status(200).send('success');
                },
                function (error) {
                    console.log(error)
                    res.status(500);
                }
            );
        }).catch(function (error) {
            console.log(error)
            res.status(500);
        });
    }
    async getCategoryPointById(req, res) {
        try {
            const { id } = req.params;
            const promise = await databases.getDocument(
                process.env.APPWRITE_DB,
                process.env.APPWRITE_CATEGORY_POINT_COLLECTION, id
            );
            if (!promise) {
                // Trả về trang 404 nếu không tìm thấy banner
                return res.status(404).render('errors/404', { title: "Page Not Found" });
            }
            return res.render('category_point/update', { title: "Cập nhập địa điểm", categoryPoint: promise });
        } catch (error) {
            console.log(error);
            return res.status(404).render('errors/404', { title: "Page Not Found" });
        }
    }
    async updateCategoryPoint(req, res) {
        if (req.file) {
            const filePath = await req.file['path'];
            const fileName = await req.file['filename'];
            const storageImage = await storage.createFile(process.env.APPWRITE_CATEGORY_POINT_BUCKET, sdk.ID.unique(), sdk.InputFile.fromPath(filePath, fileName));
            const imageUrl = `${process.env.APPWRITE_URL}/storage/buckets/${process.env.APPWRITE_CATEGORY_POINT_BUCKET}/files/${storageImage.$id}/view?project=${process.env.APPWRITE_PROJECT}`;
            const document = databases.updateDocument(
                process.env.APPWRITE_DB,
                process.env.APPWRITE_CATEGORY_POINT_COLLECTION,
                req.body.id,
                {
                    Label: getFirstLettersOfEachWord(req.body['label']),
                    full_label: req.body['label'],
                    Icon: imageUrl, 
                }
            );
            document.then(
                function (response) {
                    fs.unlink(req.file.path, (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                            return;
                        }
                        console.log('File deleted successfully');
                    });
                    res.status(200).send('success');
                },
                function (error) {
                    res.status(500);
                }
            );
        } else {
            try{
                const document = await databases.updateDocument(
                    process.env.APPWRITE_DB,
                    process.env.APPWRITE_CATEGORY_POINT_COLLECTION,
                    req.body.id,
                    {
                        Label: getFirstLettersOfEachWord(req.body['label']),
                        full_label: req.body['label'],
                    }
                );
                res.status(200).send('success');
            }catch(error){
                res.status(500).send(error);
            }
        }
    }
    async deleteCategoryPoint(req, res) {
        try {
            const { id } = req.params;
            await databases.deleteDocument(
                process.env.APPWRITE_DB,
                process.env.APPWRITE_CATEGORY_POINT_COLLECTION, id);
            res.status(200).send('success');
        } catch (error) {
            res.status(500).send(error.type);
        }
    }
}
function getFirstLettersOfEachWord(sentence) {
    // Chia chuỗi thành mảng các từ
    let words = sentence.split(" ");

    // Khai báo biến lưu trữ kết quả
    let result = "";

    // Lặp qua mỗi từ trong mảng
    for (let i = 0; i < words.length; i++) {
        // Lấy ký tự đầu tiên của từ và thêm vào kết quả
        result += words[i].charAt(0).toUpperCase();
    }

    // Trả về chuỗi kết quả
    return result;
}
module.exports = new CategoryPointController;
