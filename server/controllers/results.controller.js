import _ from 'lodash';
import moment from 'moment';
import pool from '../database/connect';

const Results = {
  async create(req, res) {
    const createQuery =
      'INSERT INTO laboratoriesresults(patientid,patientphone,labid,doctorid,result,consultation,createdon) VALUES($1,$2,$3,$4,$5,$6,$7) returning *';
    const values = [
      req.body.patientid,
      req.body.patientphone,
      req.body.labid,
      req.body.doctorid,
      _.capitalize(req.body.result),
      _.capitalize(req.body.consultation),
      moment().format('LL')
    ];
    try {
      const { rows } = await pool.query(createQuery, values);
      return res.status(201).send({
        message: 'Result added successfully',
        data: rows
      });
    } catch (error) {
      return res.status(400).send({
        message: error.message
      });
    }
  },
  async allResults(req, res) {
    const getAllQuery = 'SELECT * FROM laboratoriesresults';
    try {
      const { rows } = await pool.query(getAllQuery);
      return res.status(200).send({
        message: 'All results successfully retrived',
        data: rows
      });
    } catch (error) {
      return res.status(400).send({
        message: error.message
      });
    }
  },
  async oneResult(req, res) {
    const getResultQuery = 'SELECT * FROM laboratoriesresults WHERE id=$1';
    const values = parseInt(req.params.id);
    try {
      const { rows } = await pool.query(getResultQuery, [values]);
      if (rows.length < 1) {
        return res.status(404).send({
          status: 404,
          message: `Result with id ${req.params.id} not found`
        });
      }
      return res.status(200).send({
        message: `Result with id ${req.params.id} successfully retrieved`,
        data: rows
      });
    } catch (error) {
      return res.status(400).send({
        message: error.message
      });
    }
  },
  async deleteResult(req, res) {
    try {
      const deleteResultQuery =
        'DELETE  FROM laboratoriesresults WHERE id=$1 RETURNING *';
      const values = parseInt(req.params.id, 10);
      const { rows } = await pool.query(deleteResultQuery, [values]);
      if (rows.length < 1) {
        return res.status(404).send({
          status: 404,
          message: `Result with id ${req.params.id} is not found`
        });
      }
      return res.status(200).send({
        status: 200,
        message: `Result with id ${req.params.id} is successfully deleted`
      });
    } catch (error) {
      return res.status(400).send({
        message: error.message
      });
    }
  },
  async updateResult(req, res) {
    try {
      const checkResult = 'SELECT * FROM laboratoriesresults WHERE id=$1';
      const values = parseInt(req.params.id, 10);
      const foundResult = await pool.query(checkResult, [values]);
      if (foundResult.rowCount === 0) {
        return res.status(404).send({
          status: 404,
          message: `Result with id ${req.params.id} is not found`
        });
      }
      const updateQuery =
        'UPDATE laboratoriesresults SET result=$1,consultation=$2 WHERE id=$3';
      const { result, consultation } = req.body;
      const { rows } = await pool.query(updateQuery, [
        result,
        consultation,
        values
      ]);
      return res.status(200).send({
        status: 200,
        message: `Result with id ${req.params.id} is modified`,
        data: {
          rows,
          result: req.body.result,
          consultation: req.body.consultation
        }
      });
    } catch (error) {
      return res.status(400).send({
        message: error.message
      });
    }
  }
};
export default Results;
