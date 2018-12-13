const Router = require('koa-router');
const router = new Router();

const koaBody = require('koa-body');

const controllers = require('../controllers');
const isAuth = require('../libs/auth');

router.get('/', controllers.index);
router.get('/login', controllers.login);
router.get('/admin', isAuth, controllers.admin);
router.post('/', koaBody(), controllers.postMessage);
router.post('/login', koaBody(), controllers.auth);
router.post('/admin/skills', isAuth, koaBody(), controllers.postSkills);
router.post(
  '/admin/upload',
  isAuth,
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: process.cwd() + '/public/upload'
    },
    formLimit: 1000000
  }),
  controllers.postGoods
);

module.exports = router;
