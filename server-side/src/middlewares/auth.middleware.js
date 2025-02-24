module.exports = (req, res, next) => {
  console.log('Middleware Running');
  next();
};
