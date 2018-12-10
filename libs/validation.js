module.exports = (name, price, fileName, fileSize) => {
  if (fileName === '' || fileSize === 0) {
    return { status: 'Не загружена картинка!', err: true };
  }
  if (!name) {
    return { status: 'Не указано описание картинки!', err: true };
  }
  if (!price) {
    return { status: 'Не указано цена!', err: true };
  }
  return { status: 'Ok', err: false };
};