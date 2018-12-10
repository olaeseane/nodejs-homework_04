const fs = require('fs');
const path = require('path');

const db = require('../models/db');
const validation = require('../libs/validation');

module.exports.index = async ctx => {
  ctx.render('pages/index', { msgsemail: ctx.flash.get() });
};

module.exports.login = async ctx => {
  ctx.render('pages/login', ctx.flash.get());
};

module.exports.admin = async ctx => {
  if (!ctx.session.isAdmin) ctx.redirect('/');
  const flashMsg = ctx.flash.get();
  ctx.render('pages/admin', flashMsg || null);
};

module.exports.postMessage = ctx => {
  db.get('messages')
    .push(ctx.request.body)
    .write();
  ctx.flash.set('Контактные данные отправлены');
  ctx.redirect('/');
};

module.exports.postSkills = ctx => {
  db.get('skills')
    .push(ctx.request.body)
    .write();
  ctx.flash.set({ msgskill: 'Счетчик отправлен' });
  ctx.redirect('/admin');
};

module.exports.auth = ctx => {
  const { email, password } = ctx.request.body;
  if (
    db.get('login.email').value() === email &&
    db.get('login.password').value() === password
  ) {
    ctx.session.isAdmin = true;
    ctx.redirect('/admin');
  } else {
    ctx.session.isAdmin = false;
    ctx.flash.set({ msglogin: 'Логин и/или пароль не корректны' });
    ctx.redirect('/login');
  }
};

module.exports.postGoods = ctx => {
  const { name, price } = ctx.request.body;
  const {
    name: fileName,
    size: fileSize,
    path: filePath
  } = ctx.request.files.photo;

  const valid = validation(name, price, fileName, fileSize);
  if (valid.err) {
    fs.unlinkSync(filePath);
    ctx.flash.set({ msgfile: valid.status });
    return ctx.redirect('/admin');
  }

  let fileFullName = path.join(process.cwd(), 'public', 'upload', fileName);

  fs.rename(filePath, fileFullName, err => {
    if (err) {
      console.error(err.message);
      return;
    }
    const fileDir = fileFullName.substr(fileFullName.indexOf('\\'));
    db.get('goods')
      .push({ name: name, price: price, path: fileDir })
      .write();
    ctx.flash.set({ msgfile: 'Картинка успешно загружена' });
  });
  ctx.redirect('/admin');
};
