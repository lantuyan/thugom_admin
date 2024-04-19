const { client, account, databases } = require('../services/appwrite_client');
const { users } = require('../services/appwrite_server');
const sdk = require("node-appwrite");
const { v4: uuidv4 } = require('uuid');
//Lấy dữ liệu với role = collector và subrole = urenco
exports.viewUrenco = async (req, res) => {
    const view = await databases.listDocuments(process.env.APPWRITE_DB, process.env.APPWRITE_USER_COLLECTION, [
        sdk.Query.limit(100000),
        sdk.Query.offset(0)
    ]);
    const urencoData = view.documents.filter(doc => doc.role === 'collector' && doc.subrole === 'Urenco').map(doc => ({
        email: doc.email,
        role: doc.role,
        subrole: doc.subrole,
        phonenumber: doc.phonenumber,
        zalonumber: doc.zalonumber,
        address: doc.address,
        id: doc.$id
    }));
    res.render('subrole/urenco_index', { title: "urenco", urencoData });

}

//Lấy dữ liệu với role = collector và subrole = angency
exports.viewAngency = async (req, res) => {
    const view = await databases.listDocuments(process.env.APPWRITE_DB, process.env.APPWRITE_USER_COLLECTION, [
        sdk.Query.limit(100000),
        sdk.Query.offset(0)
    ]);
    const angencyData = view.documents.filter(doc => doc.role === 'collector' && doc.subrole === 'Angency').map(doc => ({
        email: doc.email,
        role: doc.role,
        subrole: doc.subrole,
        phonenumber: doc.phonenumber,
        zalonumber: doc.zalonumber,
        address: doc.address,
        id: doc.$id
    }));
    res.render('subrole/angency_index', { title: "angency", angencyData });

}


