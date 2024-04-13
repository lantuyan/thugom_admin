const { databases } = require('../services/appwrite_server');
const sdk = require("node-appwrite");
const moment = require('moment');
class CollectionPointController {

    async getAllCollectionPoint(req, res) {
        try {
            const pointCategories = await getAllCategory();
            const promise = await databases.listDocuments(
                process.env.APPWRITE_DB,
                process.env.APPWRITE_POINT_COLLECTION,
                [
                    sdk.Query.limit(200),
                    sdk.Query.offset(0),
                    sdk.Query.orderAsc("$createdAt"),
                    sdk.Query.select(["point_lat","point_lng","label","$createdAt","$id","info","address"]),
                ]
            );
            promise.documents.forEach(item => {
                item.$createdAt = moment(item.$createdAt).format("DD-MM-YYYY");
                item.label = mapLabelToFullLabel(item.label,pointCategories);
            });
            // res.json(promise.documents);
            res.render('collection_point/index', { title: "Địa điểm thu gom", collectionPoints: promise.documents , pointCategories: JSON.stringify(pointCategories) });
        } catch (error) {
            console.log(error);
            res.status(500).send(error.message);
        }
    }


    async createCollectionPointIndex(req, res) {
        try {
            const pointCategories = await getAllCategory();
            // res.json(pointCategories);
            res.render('collection_point/add', { title: "Thêm điểm thu gom", pointCategories: pointCategories });
        } catch (error) {
            res.status(500).send(error);
        }
    }
    async createCollectionPoint(req, res) {
        try {
            const pointCategories = await getAllCategory();
            const result = pointCategories.find(item => item.$id === req.body.label);
            await databases.createDocument(
                process.env.APPWRITE_DB,
                process.env.APPWRITE_POINT_COLLECTION,
                sdk.ID.unique(),
                {
                    point_lat: req.body.lat,
                    point_lng: req.body.lng,
                    address: req.body.address,
                    label: result.Label,
                    info: req.body.info,
                    categoryPoints: result.$id,
                }
            );
            res.status(200).send('success');
        } catch (error) {
            res.status(500).send(error);
        }
    }
    async getCollectionPointById(req, res) {
        try {
            const { id } = req.params;
            // Code để lấy thông tin của banner theo ID từ cơ sở dữ liệu (sử dụng Appwrite hoặc bất kỳ dịch vụ nào khác)
            // Ví dụ:
            const pointCategories = await getAllCategory();
            const point = await databases.getDocument(
                process.env.APPWRITE_DB,
                process.env.APPWRITE_POINT_COLLECTION, id
            );
            if (!point) {
                // Trả về trang 404 nếu không tìm thấy banner
                return res.status(404).render('errors/404', { title: "Page Not Found" });
            }
            return res.render('collection_point/update', { title: "Cập nhập địa điểm", point: point, pointCategories: pointCategories });
        } catch (error) {
            console.log(error);
            return res.status(404).render('errors/404', { title: "Page Not Found" });
        }
    }

    async updateCollectionPoint(req, res) {
        try {
            const pointCategories = await getAllCategory();
            const result = pointCategories.find(item => item.$id === req.body.label);
            await databases.updateDocument(
                process.env.APPWRITE_DB,
                process.env.APPWRITE_POINT_COLLECTION,
                req.body.id,
                {
                    point_lat: req.body.lat,
                    point_lng: req.body.lng,
                    address: req.body.address,
                    label: result.Label,
                    info: req.body.info,
                    categoryPoints: result.$id,
                }
            );
            res.status(200).send('success');
        } catch (error) {
            console.log(error)
            res.status(500).send(error);
        }
    }

    async deleteCollectionPoint(req, res) {
        try {
            const { id } = req.params;
            await databases.deleteDocument(
                process.env.APPWRITE_DB,
                process.env.APPWRITE_POINT_COLLECTION, id);
            res.status(200).send('success');
        } catch (error) {
            res.status(500).send('error');
        }
    }
}
async function getAllCategory() {
    const promise = await databases.listDocuments(
        process.env.APPWRITE_DB,
        process.env.APPWRITE_CATEGORY_POINT_COLLECTION,
        [
            sdk.Query.limit(200),
            sdk.Query.offset(0),
            sdk.Query.orderAsc("$createdAt"),
            sdk.Query.select(['$id', 'Label', 'full_label'],)
        ]
    );
    return promise.documents;
}
// Hàm ánh xạ giá trị label thành full_label
function mapLabelToFullLabel(label,data) {
    const matchingItem = data.find(item => item.Label === label);
    return matchingItem ? matchingItem.full_label : label;
}
module.exports = new CollectionPointController;
