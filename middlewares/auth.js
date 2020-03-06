const jwt = require("jsonwebtoken");
const { User } = require("../models");

const verifyToken = async (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

    const user = await User.findOne({
      where: {
        id: req.decoded.id,
      },
    });
    req.user = user;

    return next();
  } catch (err) {
    res.clearCookie("token");
    if (err.name === "TokenExpiredError") {
      return res.status(419).send("토큰이 만료되었습니다");
    }
    return res.status(401).send("유효하지 않은 토큰입니다");
  }
};

exports.verifyToken = verifyToken;
exports.isLoggedIn = (req, res, next) => {
  if (req.cookies.token) {
    verifyToken(req, res, next);
  } else {
    res.status(403).send("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.cookies.token) {
    next();
  } else {
    res.status(403).send("로그인 되어 있음");
  }
};
