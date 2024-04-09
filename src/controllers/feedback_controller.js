const { client, account,databases} = require('../services/appwrite_client');
const { users } = require('../services/appwrite_server');
const sdk = require("node-appwrite");
// const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

//view 
exports.viewFeedback = async (req, res) => {
    
    const view = await databases.listDocuments(process.env.APPWRITE_DB, process.env.APPWRITE_FEEDBACK_COLLECTION,
        [
           sdk.Query.limit(100),
           sdk.Query.offset(0)
        ]
    );
    const feedbackData = view.documents.map(doc => ({
        image:doc.image,
        phonenumber: doc.phone_number,
        address: doc.address,
        description: doc.description,
        createAt: moment(doc.createAt).format("DD-MM-YYYY"),
        id: doc.$id
    }));

    res.render('feedback/index', { title: "Feedback",feedbackData});

};



// Delete User
exports.deleteFeedback = (req, res) => {
    const userId = req.params.id;
    console.log(userId)
    databases.deleteDocument(process.env.APPWRITE_DB,process.env.APPWRITE_FEEDBACK_COLLECTION , userId).then(result =>{
        res.redirect('/feedback');
    })
    .catch(error =>{
        res.render('/errors/404')
    })

}




