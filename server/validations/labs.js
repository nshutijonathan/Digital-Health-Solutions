import validator from 'validator';

const labs = (req, res, next) => {
  if (validator.isEmpty(req.body.labname)) {
    return res.status(400).send({
      message: 'labname is required'
    });
  }
  if (validator.isEmpty(req.body.location)) {
    return res.status(400).send({
      message: 'lab location is required'
    });
  }
  if (validator.isEmpty(req.body.doctor.toString())) {
    return res.status(400).send({
      message: 'doctorId is required'
    });
  }
  if (req.body.doctor < 1) {
    return res.status(400).send({
      message: 'Invalid doctorId'
    });
  }
  next();
};
export default labs;
