const { databases, users } = require('../services/appwrite_server');
const sdk = require("node-appwrite");
const moment = require('moment'); // Import thư viện moment.js
const lodash = require('lodash');
class SiteController {
    // Route GET /login
    async index(req, res) {
        const timePeriod = req.query.timePeriod;
        var untilDate;
        if (timePeriod === '30days') {
            // Tính toán ngày kết thúc của tuần hiện tại (Chủ Nhật của tuần này)
            untilDate = moment().startOf('month').format("YYYY-MM-DD HH:mm:ss");
        } else {
            untilDate = moment().subtract(7, 'days').format("YYYY-MM-DD HH:mm:ss");
        }
        try {
            const promise = await databases.listDocuments(
                process.env.APPWRITE_DB,
                process.env.APPWRITE_REQUEST_COLLECTION,
                [
                    sdk.Query.limit(200),
                    sdk.Query.offset(0),
                    sdk.Query.greaterThanEqual('createAt', untilDate),
                    sdk.Query.orderDesc("createAt"),
                    sdk.Query.select(['status', 'createAt'],) // Chỉ lấy hai trường status và createdAt
                ]
            );
            const userQuery = await databases.listDocuments(
                process.env.APPWRITE_DB,
                process.env.APPWRITE_USER_COLLECTION,
                [
                    sdk.Query.limit(200),
                    sdk.Query.offset(0),
                    sdk.Query.greaterThanEqual('$createdAt', untilDate),
                    // sdk.Query.orderDesc("createAt"),
                    sdk.Query.select(['role', '$createdAt'],) // Chỉ lấy hai trường status và createdAt
                ]
            );
            const dataRequestDate = processData(promise.documents);
            const dataRequestByType = lodash.countBy(promise.documents, doc => lodash.capitalize(doc.status));
            const dataUser = processDataUser(userQuery.documents);
            // res.json(dataRequestByType);
            // res.render('home', { title: "Home Page", data7Days: JSON.stringify(data7Days), dataUsers: dataUsers});
            res.render('home', { title: "Home Page", dataRequestDate: JSON.stringify(dataRequestDate), dataRequestByType:JSON.stringify(dataRequestByType),dataUser: JSON.stringify(dataUser)});
        } catch (error) {
            console.log(error);
            res.status(500).send(error.message);
        }
    }


}
function processData(jsonData) {
    const formattedData = {};

    jsonData.forEach(item => {
        // Format lại trường createAt
        const createDate = moment(item.createAt, "YYYY-MM-DD HH:mm:ss.SSSSSS").format("DD-MM");

        // Đếm số lượng request từng ngày
        if (!formattedData[createDate]) {
            formattedData[createDate] = 0;
        }
        formattedData[createDate]++;
    });

    return formattedData;
}
function processDataUser(jsonData) {
    const formattedData = {};
    // Lặp qua dữ liệu và tính toán số lượng person và collector trong mỗi ngày
    jsonData.forEach(entry => {
        const createdAt = moment(entry["$createdAt"]);
        const date = createdAt.format("DD-MM");

        if (!formattedData[date]) {
            formattedData[date] = { person: 0, collector: 0 };
        }

        if (entry.role === "person") {
            formattedData[date].person++;
        } else if (entry.role === "collector") {
            formattedData[date].collector++;
        }
    });

    return formattedData;
}
function countStatusTypes(data) {
    return lodash.countBy(data);
}
module.exports = new SiteController;
