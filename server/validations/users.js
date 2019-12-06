import validator from 'validator';
const signup = (req, res, next) => {
  if (validator.isEmpty(req.body.email)) {
    return res.status(400).send({
      message: 'Email is required'
    });
  }
  if (!validator.isEmail(req.body.email)) {
    console.log(' wrong email formatis required');
    return res.status(400).send({
      message: 'wrong email format'
    });
  }
  if (validator.isEmpty(req.body.firstname)) {
    return res.status(400).send({
      message: 'firstname is required'
    });
  }
  if (validator.isEmpty(req.body.lastname)) {
    return res.status(400).send({
      message: 'lastname is required'
    });
  }

  if (validator.isEmpty(req.body.password)) {
    return res.status(400).send({
      message: 'password is required'
    });
  }
  if (validator.isEmpty(req.body.location)) {
    return res.status(400).send({
      message: 'location is required'
    });
  }
  if (validator.isEmpty(req.body.usertype)) {
    return res.status(400).send({
      message: 'usertype is required'
    });
  }
  if (validator.isEmpty(req.body.phone)) {
    return res.status(400).send({
      message: 'phone number is required'
    });
  }
  next();
};
export default signup;
