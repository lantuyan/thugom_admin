const { client, account, databases } = require('../services/appwrite_client');
const { users } = require('../services/appwrite_server');
const sdk = require("node-appwrite");
const { v4: uuidv4 } = require('uuid');

//view 
exports.viewUser = async (req, res) => {

    const view = await databases.listDocuments(process.env.APPWRITE_DB, process.env.APPWRITE_USER_COLLECTION,
        [
            sdk.Query.limit(100),
            sdk.Query.offset(0)
        ]
    );
    // Lọc ra các người dùng có vai trò là "person" và "collector"
    const personData = view.documents.filter(doc => doc.role === 'person' && (doc.ban === false ||doc.ban === null)).map(doc => ({
        email: doc.email,
        role: doc.role,
        phonenumber: doc.phonenumber,
        zalonumber: doc.zalonumber,
        address: doc.address,
        id: doc.$id
    }));
    res.render('person/index', { title: "Person", personData });

};



// Delete User
exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    databases.deleteDocument(process.env.APPWRITE_DB, process.env.APPWRITE_USER_COLLECTION, userId);
    users.delete(userId).then(function (response_delete) {
        res.redirect('/users');
    }).catch(function (error) {
        console.log('Error deleting user:', error);
        // Xử lý phản hồi lỗi ở đây
        res.status(500).send("Error deleting user");
    });
}

//create
exports.form = (req, res) => {
    res.render('person/create_user', { title: "Add person" });
}
exports.createUser = (req, res) => {
    var userId = sdk.ID.unique();
    const { name, email, phonenumber, password, zalonumber, address } = req.body;
    users.createArgon2User(userId, email, password)
        .then(response_create => {
            console.log('Person added successfully:', response_create);
            var userIdDB = response_create.$id;
            res.render('person/create_user', { alert: 'User added successfully.' });
            databases.createDocument(process.env.APPWRITE_DB, process.env.APPWRITE_USER_COLLECTION, userIdDB, { email, role: "person", name, phonenumber, zalonumber, address, uid: userIdDB });
        }).catch(error => {
            console.error('Error adding user:', error);
            res.render('person/create_user', { alert: 'Failed to add user. Please try again later.' });
        });
}
// Edit
exports.editUser = (req, res) => {
    const userId = req.params.id;
    databases.getDocument(process.env.APPWRITE_DB, process.env.APPWRITE_USER_COLLECTION, userId)
        .then(result => {
            res.render('person/edit_user', { title: "Edit user", result });
        })
        .catch(error => {
            console.error(error);
            res.redirect('/users');
        });
};


exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const { name, email, phonenumber, zalonumber, address, role } = req.body;

    databases.updateDocument(process.env.APPWRITE_DB, process.env.APPWRITE_USER_COLLECTION, userId,
        {
            name: name,
            email: email,
            phonenumber: phonenumber,
            zalonumber: zalonumber,
            address: address,
            role: role

        })
        .then(response_update => {
            res.redirect('/users', { alert: 'User update successfully.' });
        }).catch(error => {
            console.error('Error updat user:', error);
            res.redirect('/users');
        });


}
exports.banUser = (req, res) => {
    const userId = req.params.id;
    const { name, email, phonenumber, zalonumber, address, role ,ban} = req.body;

    databases.updateDocument(process.env.APPWRITE_DB, process.env.APPWRITE_USER_COLLECTION, userId,
        {
            name: name,
            email: email,
            phonenumber: phonenumber,
            zalonumber: zalonumber,
            address: address,
            role: role,
            ban: true
        })
        .then(response_update => {
            res.redirect('/users');
        }).catch(error => {
            console.error('Error updat user:', error);
            res.redirect('/users');
        });
}

