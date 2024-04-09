const { client, account,databases } = require('../services/appwrite_client');
const { users } = require('../services/appwrite_server');
const sdk = require("node-appwrite");
const { v4: uuidv4 } = require('uuid');
//Lấy dữ liệu với role = collector và subrole = urenco
exports.viewUrenco= async (req, res) => {
    const view = await databases.listDocuments(process.env.APPWRITE_DB, process.env.APPWRITE_USER_COLLECTION,[
        sdk.Query.limit(100),
        sdk.Query.offset(0)
    ]);
    const urencoData = view.documents.filter(doc => doc.role === 'collector' && doc.subrole ==='Urenco').map(doc => ({
        username: doc.username,
        email: doc.email,
        role: doc.role,
        subrole: doc.subrole,
        phonenumber: doc.phonenumber,
        address: doc.address,
        id: doc.$id
    }));
    res.render('subrole/urenco_index', { title: "urenco", urencoData });

}

//Lấy dữ liệu với role = collector và subrole = angency
exports.viewAngency= async (req, res) => {
    const view = await databases.listDocuments(process.env.APPWRITE_DB, process.env.APPWRITE_USER_COLLECTION,[
        sdk.Query.limit(100),
        sdk.Query.offset(0)
    ]);
    const angencyData = view.documents.filter(doc => doc.role === 'collector' && doc.subrole ==='Angency').map(doc => ({
        username: doc.username,
        email: doc.email,
        role: doc.role,
        subrole:doc.subrole,
        phonenumber: doc.phonenumber,
        address: doc.address,
        id: doc.$id
    }));
    res.render('subrole/angency_index', { title: "angency", angencyData });

}

// Delete User
exports.deleteCollector = (req, res) => {
    const userId = req.params.id;
    databases.deleteDocument(process.env.APPWRITE_DB,process.env.APPWRITE_USER_COLLECTION , userId);
    users.delete(userId).then(function (response_delete) {
        res.redirect('/collectors');
    }).catch(function(error) {
        console.log('Error deleting user:', error);
        // Xử lý phản hồi lỗi ở đây
        res.status(500).send("Error deleting user");  
    });
}


// Edit
exports.editCollector = (req, res) => {
    const userId = req.params.id;
    databases.getDocument(process.env.APPWRITE_DB, process.env.APPWRITE_USER_COLLECTION, userId)
    .then(result => {
        res.render('collector/edit_collector', {title:"Edit user",result});
    })
    .catch(error => {
        console.error(error);
        res.redirect('/collectors');
    });
};


exports.updateCollector = (req, res) => {
    const userId = req.params.id; 
    const { name, email, phonenumber,zalonumber,address,username } = req.body;

    databases.updateDocument(process.env.APPWRITE_DB,process.env.APPWRITE_USER_COLLECTION, userId, 
    {
        name:name,
        email:email,
        phonenumber:phonenumber,
        zalonumber: zalonumber,
        username:username,
        address:address
        
    })
    .then(response_update => {
        res.render('collector/edit_collector',{ alert: 'User update successfully.' });
      }).catch(error => {
        console.error('Error updat user:', error);
        res.redirect('/collectors');
    });
    users.updateEmail(userId, email);
    users.updateName(userId, name);



}

