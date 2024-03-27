const { client, account,databases} = require('../services/appwrite_client');
const { users } = require('../services/appwrite_server');
const sdk = require("node-appwrite");
// const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

//view 
exports.viewRequest = async (req, res) => {
    
    const view = await databases.listDocuments(process.env.APPWRITE_DB, process.env.APPWRITE_REQUEST_COLLECTION,
        [
           sdk.Query.limit(100),
           sdk.Query.offset(0)
        ]
    );
    const requestData = view.documents.map(doc => ({
        phonenumber: doc.phone_number,
        address: doc.address,
        description: doc.description,
        status:doc.status,
        trashtype:doc.trash_type,
        createAt: moment(doc.createAt).format("DD-MM-YYYY"),
        id: doc.$id
    }));

    res.render('request/index', { title: "Request",requestData});

};



// Delete User
exports.deleteRequest = (req, res) => {
    const userId = req.params.id;
    console.log(userId)
    databases.deleteDocument(process.env.APPWRITE_DB,process.env.APPWRITE_REQUEST_COLLECTION , userId).then(result =>{
        res.redirect('/requests');
    })
    .catch(error =>{
        res.render('/errors/404')
    })

}


// Edit
exports.editRequest = (req, res) => {
    const userId = req.params.id;
    databases.getDocument(process.env.APPWRITE_DB, process.env.APPWRITE_REQUEST_COLLECTION, userId)
    .then(result => {
        res.render('request/edit_request', {title:"Edit request",result});
    })
    .catch(error => {
        console.error(error);
        res.redirect('/requests');
    });
};


exports.updateRequest = (req, res) => {
    const userId = req.params.id; 
    const {  phonenumber,address,description,status,trashtype} = req.body;

    databases.updateDocument(process.env.APPWRITE_DB,process.env.APPWRITE_REQUEST_COLLECTION, userId, 
    {
        phone_number:phonenumber,
        address:address,
        status:status,
        description:description,
        trash_type:trashtype
    })
    .then(response_update => {
        res.render('request/edit_user',{ alert: 'User update successfully.' });
      }).catch(error => {
        console.error('Error updat user:', error);
        res.redirect('/requests');
    });

}

