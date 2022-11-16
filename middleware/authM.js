import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const secret = "test";

const authM = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;
    let decodeData;
    if (token && isCustomAuth) {
      decodeData = jwt.verify(token, secret);
      req.userId = decodeData?.id;
    } else {
      decodeData = jwt.decode(token);
      const googleId = decodeData?.sub.toString();
      const user = await User.findOne({ googleId });
      req.userId = user?._id;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export default authM;
