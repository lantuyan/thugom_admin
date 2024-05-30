const { databases, storage } = require('../services/appwrite_server');
const { users } = require('../services/appwrite_server');
const sdk = require("node-appwrite");
// const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

//view 
exports.viewRequest = async (req, res) => {

    const view = await databases.listDocuments(process.env.APPWRITE_DB, process.env.APPWRITE_REQUEST_COLLECTION,
        [
            sdk.Query.limit(100000),
            sdk.Query.offset(0)
        ]
    );
    const requestData = view.documents.map(doc => ({
        phonenumber: doc.phone_number,
        address: doc.address,
        description: doc.description,
        status: doc.status,
        trashtype: doc.trash_type,
        price: doc.collection_price,
        amount: doc.amount_collected,
        createAt: moment(doc.createAt).format("DD-MM-YYYY"),
        id: doc.$id
    }));

    res.render('request/index', { title: "Request", requestData });

};

exports.viewRequestConfirming = async (req, res) => {

    const view = await databases.listDocuments(process.env.APPWRITE_DB, process.env.APPWRITE_REQUEST_COLLECTION,
        [
            sdk.Query.limit(100000),
            sdk.Query.offset(0),
            sdk.Query.equal("status","confirming"),
        ]
    );
    const requestData = view.documents.map(doc => ({
        phonenumber: doc.phone_number,
        address: doc.address,
        description: doc.description,
        status: doc.status,
        trashtype: doc.trash_type,
        price: doc.collection_price,
        amount: doc.amount_collected,
        createAt: moment(doc.createAt).format("DD-MM-YYYY"),
        id: doc.$id
    }));

    res.render('request/confirming', { title: "Request", requestData });

};

exports.confirmRequest = async (req, res) => {
    // res.status(500).send(req.params);

    try {
        const {id}  = req.params;
        await databases.updateDocument(
            process.env.APPWRITE_DB,
            process.env.APPWRITE_REQUEST_COLLECTION,
            id,
            {
                status: "finish",
            }
        );
        console.log("finish")
        res.status(200).send('success');
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
};


// Delete User
exports.deleteRequest = (req, res) => {
    const userId = req.params.id;
    console.log(userId)
    databases.deleteDocument(process.env.APPWRITE_DB, process.env.APPWRITE_REQUEST_COLLECTION, userId).then(result => {
        res.redirect('/requests');
    })
        .catch(error => {
            res.render('/errors/404')
        })

}


// Edit
exports.editRequest = (req, res) => {
    const userId = req.params.id;
    databases.getDocument(process.env.APPWRITE_DB, process.env.APPWRITE_REQUEST_COLLECTION, userId)
        .then(result => {
            res.render('request/edit_request', { title: "Edit request", result });
        })
        .catch(error => {
            console.error(error);
            res.redirect('/requests');
        });
};


exports.updateRequest = (req, res) => {
    const requestId = req.params.id;
    var { phonenumber, address, description, status, trashtype, price, amount,metal,paper,bottle,hdpe,nilon,others } = req.body;

    metal = metal ? metal.toString() : '0';
    paper = paper ? paper.toString() : '0';
    bottle = bottle ? bottle.toString() : '0';
    hdpe = hdpe ? hdpe.toString() : '0';
    nilon = nilon ? nilon.toString() : '0';
    others = others ? others.toString() : '0';

    databases.updateDocument(process.env.APPWRITE_DB, process.env.APPWRITE_REQUEST_COLLECTION, requestId,
        {
            phone_number: phonenumber,
            address: address,
            status: status,
            description: description,
            trash_type: trashtype,
            collection_price: price,
            amount_collected: amount,
            metal:metal,
            paper:paper,
            bottle:bottle,
            hdpe:hdpe,
            nilon:nilon,
            others:others,
        })
        .then(response_update => {
            res.redirect('/requests');
        }).catch(error => {
            console.error('Error updat user:', error);
            res.redirect('/requests');
        });

}

