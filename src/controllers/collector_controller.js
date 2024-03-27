const { client, account,databases } = require('../services/appwrite_client');
const { users } = require('../services/appwrite_server');
const sdk = require("node-appwrite");
const { v4: uuidv4 } = require('uuid');
//view 
exports.viewCollector = async (req, res) => {
    const view = await databases.listDocuments(process.env.APPWRITE_DB, process.env.APPWRITE_USER_COLLECTION,[
        sdk.Query.limit(100),
        sdk.Query.offset(0)
    ]);
    const collectorData = view.documents.filter(doc => doc.role === 'collector').map(doc => ({
        username: doc.username,
        email: doc.email,
        role: doc.role,
        phonenumber: doc.phonenumber,
        address: doc.address,
        id: doc.$id
    }));
    res.render('collector/index', { title: "collector", collectorData });

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

//create
exports.form = (req, res) => {
    res.render('collector/create_collector',{title:"Add collector"});
}
exports.createCollector = (req, res) => {
    var userId = sdk.ID.unique();
    const { name, email, phonenumber, password,zalonumber,address,username } = req.body;
    users.create(userId,email,phonenumber,password,name )
    .then(response_create => {
        console.log('Collector added successfully:', response_create);
        var userIdDB = response_create.$id;
        res.render('collector/create_collector', { alert: 'User added successfully.' });
        databases.createDocument(process.env.APPWRITE_DB,process.env.APPWRITE_USER_COLLECTION, userIdDB, {email,username,role : "collector",name,phonenumber,zalonumber,address,uid:userIdDB});
      }).catch(error => {
        console.error('Error adding user:', error);
        res.render('collector/create_collector', { alert: 'Failed to add user. Please try again later.' });
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

