const loginRouter = require('./auth_route')
const siteRouter = require('./site_route')
const personRouter = require('./person_route')
const collectorRouter = require('./collector_route')
const requestRouter = require('./request_route')
const { isLoggedIn, isLoggedSS } = require('../middlewares/login_middleware');

function route(app) {
    app.use('/auth',isLoggedSS, loginRouter);
    app.use('/',isLoggedIn, siteRouter);
    app.use('/users',isLoggedIn, personRouter);
    app.use('/collectors',isLoggedIn, collectorRouter);
    app.use('/requests',isLoggedIn, requestRouter);
    // app.get('/login', function (req, res) {
    //     res.render('auth/login');
    // })
    // app.post('/login', function (req, res) {
    //     res.send('');
    //     console.log(req.body);
    // })
}
module.exports = route;