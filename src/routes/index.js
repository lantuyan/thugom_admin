const loginRouter = require('./auth_route')
const siteRouter = require('./site_route')
const personRouter = require('./person_route')
const collectorRouter = require('./collector_route')
const requestRouter = require('./request_route')
const collectionPointRouter = require('./collection_point_route')
const urencoRouter = require('./urenco_route')
const angencyRouter = require('./angency_route')
const blacklistRouter = require('./blacklist_route')
const feedbackRouter = require('./feedback_route')
const categoryPointRouter = require('./category_point')
const { isLoggedIn, isLoggedSS } = require('../middlewares/login_middleware');

function route(app) {
    app.use('/auth',isLoggedSS, loginRouter);
    app.use('/',isLoggedIn, siteRouter);
    app.use('/users',isLoggedIn, personRouter);
    app.use('/collectors',isLoggedIn, collectorRouter);
    app.use('/requests',isLoggedIn, requestRouter);
    app.use('/collection-points',isLoggedIn, collectionPointRouter);
    app.use('/urenco',isLoggedIn, urencoRouter);
    app.use('/angency',isLoggedIn, angencyRouter);
    app.use('/blacklist',isLoggedIn, blacklistRouter);
    app.use('/feedback',isLoggedIn, feedbackRouter);
    app.use('/category-points',isLoggedIn, categoryPointRouter);
    // app.get('/login', function (req, res) {
    //     res.render('auth/login');
    // })
    // app.post('/login', function (req, res) {
    //     res.send('');
    //     console.log(req.body);
    // })
}
module.exports = route;