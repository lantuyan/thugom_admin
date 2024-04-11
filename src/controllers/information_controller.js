const { databases, storage } = require('../services/appwrite_server');
const sdk = require("node-appwrite");
const moment = require('moment');
const fs = require('fs');
class InformationController {

    async getAllInformation(req, res) {
        try {
            const promise = await databases.listDocuments(
                process.env.APPWRITE_DB,
                process.env.APPWRITE_INFORMATION_COLLECTION,
                [
                    sdk.Query.limit(200),
                    sdk.Query.offset(0),
                    sdk.Query.orderAsc("$createdAt"),
                ]
            );
            promise.documents.forEach(item => {
                item.$createdAt = moment(item.$createdAt).format("DD-MM-YYYY");
            });
            res.render('information/index', { title: "Bài viết thông tin", information: promise.documents});
        } catch (error) {
            console.log(error);
            res.status(500).send(error.message);
        }
    }
    async createInformationIndex(req, res) {
        try {
            res.render('information/add', { title: "Thêm bài viết"});
        } catch (error) {
            res.status(500).send(error);
        }
    }
    async createInformation(req, res) {
        const filePath = await req.file['path'];
        const fileName = await req.file['filename'];
        // res.json(filePath+fileName);
        const storageImage = storage.createFile(process.env.APPWRITE_INFORMATION_BUCKET, sdk.ID.unique(), sdk.InputFile.fromPath(filePath, fileName));
        storageImage.then(function (imageInfo) {
            // Nếu việc tải ảnh lên thành công, tiếp tục để tạo tài liệu
            const imageUrl = `${process.env.APPWRITE_URL}/storage/buckets/${process.env.APPWRITE_INFORMATION_BUCKET}/files/${imageInfo.$id}/view?project=${process.env.APPWRITE_PROJECT}`;
            const document = databases.createDocument(
                process.env.APPWRITE_DB,
                process.env.APPWRITE_INFORMATION_COLLECTION,
                sdk.ID.unique(),
                {
                    title: req.body['title'],
                    link: req.body['link'],
                    description: req.body['description'],
                    imagelink: imageUrl, 
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
    async getInformationById(req, res) {
        try {
            const { id } = req.params;
            const promise = await databases.getDocument(
                process.env.APPWRITE_DB,
                process.env.APPWRITE_INFORMATION_COLLECTION, id
            );
            if (!promise) {
                // Trả về trang 404 nếu không tìm thấy banner
                return res.status(404).render('errors/404', { title: "Page Not Found" });
            }
            return res.render('information/update', { title: "Cập nhập bài viết", information: promise });
        } catch (error) {
            console.log(error);
            return res.status(404).render('errors/404', { title: "Page Not Found" });
        }
    }
    async updateInformation(req, res) {
        if (req.file) {
            const filePath = await req.file['path'];
            const fileName = await req.file['filename'];
            const storageImage = await storage.createFile(process.env.APPWRITE_INFORMATION_BUCKET, sdk.ID.unique(), sdk.InputFile.fromPath(filePath, fileName));
            const imageUrl = `${process.env.APPWRITE_URL}/storage/buckets/${process.env.APPWRITE_INFORMATION_BUCKET}/files/${storageImage.$id}/view?project=${process.env.APPWRITE_PROJECT}`;
            const document = databases.updateDocument(
                process.env.APPWRITE_DB,
                process.env.APPWRITE_INFORMATION_COLLECTION,
                req.body.id,
                {
                    title: req.body['title'],
                    link: req.body['link'],
                    description: req.body['description'],
                    imagelink: imageUrl, 
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
        } else {
            try{
                const document = await databases.updateDocument(
                    process.env.APPWRITE_DB,
                    process.env.APPWRITE_INFORMATION_COLLECTION,
                    req.body.id,
                    {
                        title: req.body['title'],
                        link: req.body['link'],
                        description: req.body['description'],
                    }
                );
                res.status(200).send('success');
            }catch(error){
                console.log(error)
                res.status(500).send(error);
            }
        }
    }
    async deleteInformation(req, res) {
        try {
            const { id } = req.params;
            await databases.deleteDocument(
                process.env.APPWRITE_DB,
                process.env.APPWRITE_INFORMATION_COLLECTION, id);
            res.status(200).send('success');
        } catch (error) {
            console.log(error)
            res.status(500).send(error.type);
        }
    }
}
module.exports = new InformationController;
