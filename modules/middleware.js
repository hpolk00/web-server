module.exports = middleware = {
  reqAuth: function(req, res, next) {
    console.log('private route hit');
      next();
  },
  logger: function(req, res, next) {
      console.log("Request: " + req.method + ' ' + req.originalUrl + new       Date().toString());
      next();
  }
};