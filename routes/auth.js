const jwt = require("jsonwebtoken");
const Router = require("express").Router;
const router = new Router();

const User = require("../models/user");
const {SECRET_KEY} = require("../config");
const ExpressError = require("../expressError");


/** login: {username, password} => {token} */

router.get('/login', function(req, res, next) {
  try {
      res.render('login')
  }
  catch (err) {
      console.log(err)
  }
});

router.post("/login", async function (req, res, next) {
  try {
    let {username, password} = req.body;
    if (await User.authenticate(username, password)) {
      let token = jwt.sign({username}, SECRET_KEY);
      User.updateLoginTimestamp(username);
      return res.json({token});
    } else {
      throw new ExpressError("Invalid username/password", 400);
    }
  }

  catch (err) {
    return next(err);
  }
});

/** register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

router.get('/register', function(req, res, next) {
  try {
      res.render('register')
  }
  catch (err) {
      console.log(err)
  }
});

router.post("/register", async function (req, res, next) {
  try {
    let {username} = await User.register(req.body);
    let token = jwt.sign({username}, SECRET_KEY);
    User.updateLoginTimestamp(username);
    return res.json({token});
  }

  catch (err) {
    return next(err);
  }
});



module.exports = router;