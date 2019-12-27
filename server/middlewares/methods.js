const method = (req, res) => {
  res.status(405).send({
    status: 405,
    message: 'METHOD NOT ALLOWED'
  });
};
export default method;
