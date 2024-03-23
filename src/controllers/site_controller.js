class SiteController {
    // Route GET /login
    index(req, res) {
        res.render('home',{title:"Home Page"});
    }

}

module.exports = new SiteController;
