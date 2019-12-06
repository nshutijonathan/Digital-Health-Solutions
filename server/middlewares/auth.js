import jwt from 'jsonwebtoken';
// middle ware definition;
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(402).send({
      status: 402,
      message: 'Access Denied.No token provided'
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(400).send({
      status: 400,
      message: 'Invalid token'
    });
  }
};
export default auth;
