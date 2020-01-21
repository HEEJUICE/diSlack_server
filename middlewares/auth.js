exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    console.log("로그인 필요");
    res.status(403).send("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    console.log("로그인 되어 잇음");
    res.status(403).send("로그인 되어 있음");
  }
};
