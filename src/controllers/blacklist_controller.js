const { databases, storage } = require('../services/appwrite_server');
const { users } = require('../services/appwrite_server');
const sdk = require("node-appwrite");
const { v4: uuidv4 } = require('uuid');
//Lấy dữ liệu với role = collector và subrole = urenco
exports.viewBlacklist = async (req, res) => {
    const view = await databases.listDocuments(process.env.APPWRITE_DB, process.env.APPWRITE_USER_COLLECTION, [
        sdk.Query.limit(100000),
        sdk.Query.offset(0)
    ]);
    const blacklistData = view.documents.filter(doc => doc.ban === true).map(doc => ({
        email: doc.email,
        role: doc.role,
        phonenumber: doc.phonenumber,
        zalonumber: doc.zalonumber,
        address: doc.address,
        id: doc.$id
    }));
    res.render('blacklist/index', { title: "Black List", blacklistData });

}


// Delete User
exports.deleteBlacklist = (req, res) => {
    const userId = req.params.id;
    databases.deleteDocument(process.env.APPWRITE_DB, process.env.APPWRITE_USER_COLLECTION, userId);
    users.delete(userId).then(function (response_delete) {
        res.redirect('/blacklist');
    }).catch(function (error) {
        console.log('Error deleting user:', error);
        // Xử lý phản hồi lỗi ở đây
        res.status(500).send("Error deleting user");
    });
}

/*
// Edit
exports.editBlacklist = (req, res) => {
    const userId = req.params.id;
    databases.getDocument(process.env.APPWRITE_DB, process.env.APPWRITE_USER_COLLECTION, userId)
    .then(result => {
        res.render('blacklist/edit_blacklist', {title:"Edit user",result});
    })
    .catch(error => {
        console.error(error);
        res.redirect('/blacklist');
    });
};
*/


exports.updateBlacklist = (req, res) => {
    const userId = req.params.id;
    const { name, email, phonenumber, zalonumber, address, role } = req.body;

    databases.updateDocument(process.env.APPWRITE_DB, process.env.APPWRITE_USER_COLLECTION, userId,
        {
            name: name,
            email: email,
            phonenumber: phonenumber,
            zalonumber: zalonumber,
            address: address,
            role: role,
            ban: false

        })
        .then(response_update => {
            res.redirect('/blacklist');
        }).catch(error => {
            console.error('Error updat user:', error);
            res.redirect('/blacklist');
        });

}

