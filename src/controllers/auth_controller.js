const { client, account,databases } = require('../services/appwrite_client');
const { users } = require('../services/appwrite_server');
class AuthController {
    // Route GET /login
    login(req, res) {
        res.render('auth/login',{title:"Login Page"});
    }
    // Route POST /login
    async loginSubmit(req, res) {
        const { email, password } = req.body;
        // Create session
        await account.createEmailPasswordSession(email, password).then(async (value) => {
            if((await users.get(value.userId)).labels.includes("admin")){
                req.session.isLoggedIn = true;
                req.session.sessionId = value.$id;
                req.session.userId = value.userId;
                res.redirect('/');
            }else{
                res.status(400).render('auth/login', { message: "Your account does not have access permissions",title:"Login Page"});
            } 
        }).catch((error) => {
            console.log(error);
            if(error.type == 'user_invalid_credentials' || error.type == 'general_argument_invalid'){
                res.status(400).render('auth/login', { message: "Invalid email or password",title:"Login Page" });
            }else{
                res.status(400).render('auth/login', { message: "An error occurred. Please try again later" });
            }
        });
    }

    // Route GET /logout
    async logout(req, res) {
        try {
            await users.deleteSession(req.session.userId, req.session.sessionId);
            req.session.isLoggedIn = false;
            req.session.sessionId = null;
            req.session.userId = null;
            res.status(200).send('Logout successful');
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

module.exports = new AuthController;
