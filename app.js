const Koa = require('koa');
const Pug = require('koa-pug');
const session = require('koa-session');
const flash = require('koa-flash-simple');
const fs = require('fs');

const router = require('./routes');
const config = require('./config/config');

const app = new Koa();

const pug = new Pug({
  viewPath: './views',
  pretty: false,
  basedir: './views',
  noCache: true,
  app: app
});

app.use(require('koa-static')('./public'));

app.use(require('./libs/error'));
app.on('error', (err, ctx) => {
  ctx.render('pages/error', {
    status: err.status,
    message: err.message
  });
});

app.use(session(config.session, app));
app.use(flash());
app.use(router.routes()).use(router.allowedMethods());

const server = app.listen(process.env.PORT || 3000, () => {
  if (!fs.existsSync(config.upload)) {
    fs.mkdirSync(config.upload);
  }
  console.log(`Server is running on port ${server.address().port}`);
});
