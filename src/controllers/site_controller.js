const { databases, users } = require('../services/appwrite_server');
const sdk = require("node-appwrite");
const moment = require('moment'); // Import thư viện moment.js
const lodash = require('lodash');
class SiteController {
    // Route GET /login
    async index(req, res) {
        var startDate = req.query.startDate;
        var endDate = req.query.endDate;
        
        const isValidTimestamp = (timestamp) => {
            return moment(timestamp, 'x', true).isValid();
        };

        // Check if the dates are present and valid
        if (!startDate || !endDate) {
            startDate = moment().subtract(7, 'days').startOf('day').valueOf();
            endDate = moment().endOf('day').valueOf();
        } else if (!isValidTimestamp) {
            return res.status(404).render('errors/404', { title: "Page Not Found" });
        }

        // Convert timestamps to ISO 8601 format for response
        const startDateISO = moment(parseInt(startDate)).toISOString();
        const endDateISO = moment(parseInt(endDate)).toISOString();
        try {
            const promise = await databases.listDocuments(
                process.env.APPWRITE_DB,
                process.env.APPWRITE_REQUEST_COLLECTION,
                [
                    sdk.Query.limit(100000),
                    sdk.Query.offset(0),
                    sdk.Query.greaterThanEqual('$createdAt', startDateISO),
                    sdk.Query.lessThanEqual('$createdAt', endDateISO),
                    sdk.Query.orderAsc("$createdAt"),
                    sdk.Query.select(['status', 'createAt','collection_price','amount_collected']) 
                ]
            );
            const userQuery = await databases.listDocuments(
                process.env.APPWRITE_DB,
                process.env.APPWRITE_USER_COLLECTION,
                [
                    sdk.Query.limit(100000),
                    sdk.Query.offset(0),
                    sdk.Query.greaterThanEqual('$createdAt', startDateISO),
                    sdk.Query.lessThanEqual('$createdAt', endDateISO),
                    sdk.Query.select(['role', '$createdAt'],)
                ]
            );
            // Tính tổng collection_price
            const totalCollectionPrice = lodash.sumBy(promise.documents, item => parseInt(item.collection_price || 0)).toLocaleString();
            // Tính tổng amount_collected
            const totalAmountCollected = lodash.sumBy(promise.documents, item => parseInt(item.amount_collected || 0)).toLocaleString();
        
            const dataRequestDate = processData(promise.documents);
            const dataRequestByType = lodash.countBy(promise.documents, doc => lodash.capitalize(doc.status));
            const dataUser = processDataUser(userQuery.documents);
            const dataRequestAmount = {
                'totalCollectionPrice' : totalCollectionPrice,
                'totalAmountCollected' : totalAmountCollected
            }
            return res.render('home', { title: "Home Page", dataRequestDate: JSON.stringify(dataRequestDate), dataRequestByType:JSON.stringify(dataRequestByType),dataUser: JSON.stringify(dataUser),dataRequestAmount:dataRequestAmount});
        } catch (error) {
            console.log(error);
            return res.status(500).send(error.message);
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
