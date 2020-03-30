import _ from 'lodash';
import moment from 'moment';
import pool from '../database/connect';

const Labs = {
  async create(req, res) {
    const createQuery =
      'INSERT INTO laboratories(labname,location,doctorId,createdon)VALUES($1,$2,$3,$4) returning *';

    const values = [
      _.capitalize(req.body.labname),
      _.capitalize(req.body.location),
      req.body.doctorId,
      moment().format('LL')
    ];

    try {
      const { rows } = await pool.query(createQuery, values);
      return res.status(200).send({
        message: 'Lab is sucessfully created',
        data: {
          rows
        }
      });
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(409).send({
          status: 409,
          message: 'lab name already exists'
        });
      }
      if (error) {
        return res.status(400).send({
          status: 400,
          message: error.message
        });
      }
    }
  },
  async allLabs(req, res) {
    try {
      const queryLabs = 'SELECT * FROM laboratories';
      const { rows } = await pool.query(queryLabs);
      return res.status(200).send({
        status: 200,
        message: 'All labs successfully retrieved',
        data: rows
      });
    } catch (error) {
      return res.status(400).send({
        message: error.message
      });
    }
  }
};
export default Labs;
