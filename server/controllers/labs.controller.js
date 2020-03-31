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
    const queryLabs = 'SELECT * FROM laboratories';
    try {
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
  },
  async oneLab(req, res) {
    const queryLabs = 'SELECT * FROM laboratories WHERE labname=$1';
    try {
      const { rows } = await pool.query(queryLabs, [req.params.labname]);
      if (rows.rowCount === 0) {
        return res.status(404).send({
          message: `Lab with name ${req.params.labname} is not found`
        });
      }
      return res.status(200).send({
        status: 200,
        message: `Lab with name ${req.params.labname} is retrieved successfully`,
        data: rows
      });
    } catch (error) {
      return res.send({
        message: error.message
      });
    }
  },
  async deleteLab(req, res) {
    const deleteQuery = 'DELETE FROM laboratories WHERE labname=$1 RETURNING *';
    try {
      const { rows } = await pool.query(deleteQuery, [req.params.labname]);
      if (rows.length < 1) {
        return res.status(404).send({
          message: `Lab with name ${req.params.labname} is not found`
        });
      }
      return res.status(200).send({
        message: `Lab with name ${req.params.labname} is successfully deleted `
      });
    } catch (error) {
      return res.status(400).send({
        message: error.message
      });
    }
  },
  async updateLab(req, res) {
    const checkLab = 'SELECT * FROM laboratories WHERE labname=$1';
    try {
      const foundLab = await pool.query(checkLab, [req.params.labname]);
      if (foundLab.rowCount === 0) {
        return res.status(404).send({
          message: `Lab with name ${req.params.labname} is not found`
        });
      }

      const updateLab =
        'UPDATE laboratories SET labname=$1,location=$2,doctorId=$3 WHERE labname=$4';
      const { labname, location, doctorId } = req.body;
      const { rows } = await pool.query(updateLab, [
        labname,
        location,
        doctorId,
        req.params.labname
      ]);
      return res.status(200).send({
        message: `Lab with name ${req.params.labname} is modified`,
        data: {
          rows,
          id: foundLab.rows[0].id,
          labname: req.body.labname,
          location: req.body.location,
          doctorId: req.body.doctorId
        }
      });
    } catch (error) {
      return res.status(400).send({
        message: error.message
      });
    }
  }
};
export default Labs;
