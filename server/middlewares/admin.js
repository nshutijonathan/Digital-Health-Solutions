const admin = (req, res, next) => {
  if (!(req.user.usertype === 'admin')) {
    return res.status(403).send({
      status: 403,
      message: 'Access denied,only admin',
    });
  }
  next();
};
export default admin;
