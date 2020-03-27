import jwt from 'jsonwebtoken';
import moment from 'moment';
import pool from '../database/connect';
import userHelpers from '../helpers/users';
const Users = {
  async create(req, res) {
    const hashpassword = userHelpers.hashPassword(req.body.password);
    const createQuery = `INSERT INTO users(email,firstname,lastname,password,location,usertype,phone,gender,approved,verified,createdon) VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning *`;
    const values = [
      req.body.email,
      req.body.firstname,
      req.body.lastname,
      hashpassword,
      req.body.location,
      req.body.usertype,
      req.body.phone,
      req.body.gender,
      false,
      false,
      moment().format('LL')
    ];

    try {
      const { rows } = await pool.query(createQuery, values);
      console.log('=======', rows);
      const token = jwt.sign(
        {
          id: rows[0].id,
          email: rows[0].email,
          usertype: rows[0].usertype
        },
        process.env.SECRET_KEY,
        { expiresIn: '24hrs' }
      );
      return res.status(201).send({
        status: 201,
        message: 'User is successfully created',
        token,
        data: {
          rows
        }
      });
    } catch (error) {
      if (error.routine == '_bt_check_unique') {
        return res.status(409).send({
          status: 409,
          message: 'Email already exist'
        });
      }
      if (error) {
        console.log('****************', error);
        return res.status(400).send({
          status: 400,
          message: error.message
        });
      }
    }
  },
  async adminCreate(req, res) {
    const email = [req.user.email];
    console.log('req', req);
    const checkUser = 'SELECT * FROM users WHERE email=$1';
    const foundUser = await pool.query(checkUser, email);
    console.log('foundUser', foundUser);
    if (foundUser.rowCount === 0) {
      return res.status(404).send({
        status: 404,
        message: 'This token owner is no longer in db'
      });
    }
    const hashpassword = userHelpers.hashPassword(req.body.password);
    const createQuery = `INSERT INTO users(email,firstname,lastname,password,location,usertype,phone,gender,approved,verified,createdon) VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning *`;
    const values = [
      req.body.email,
      req.body.firstname,
      req.body.lastname,
      hashpassword,
      req.body.location,
      req.body.usertype,
      req.body.phone,
      req.body.gender,
      false,
      false,
      moment().format('LL')
    ];
    try {
      const { rows } = await pool.query(createQuery, values);
      console.log('======', rows);
      const token = jwt.sign(
        {
          id: rows[0].id,
          email: rows[0].email,
          usertype: rows[0].usertype
        },
        process.env.SECRET_KEY,
        { expiresIn: '24hrs' }
      );
      return res.status(201).send({
        status: 201,
        message: 'User is successfully created',
        token,
        data: {
          rows
        }
      });
    } catch (error) {
      if (error.routine == '_bt_check_unique') {
        return res.status(409).send({
          status: 409,
          message: 'Email already exist'
        });
      }
    }
    return res.status(400).send({
      status: 400,
      message: error.message
    });
  },
  async login(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({
        status: 400,
        message: 'some values are missing'
      });
    }
    const text = 'SELECT * FROM users WHERE email=$1 ';
    try {
      const { rows } = await pool.query(text, [req.body.email]);
      if (!rows[0]) {
        return res.status(401).send({
          status: 401,
          message: 'INVALID email or password'
        });
      }
      if (!userHelpers.comparePassword(rows[0].password, req.body.password)) {
        return res.status(401).send({
          status: 401,
          message: 'INVALID email or password'
        });
      }
      const token = jwt.sign(
        {
          id: rows[0].id,
          email: rows[0].email,
          usertype: rows[0].usertype,
          verified: rows[0].verified,
          approved: rows[0].approved
        },
        process.env.SECRET_KEY,
        { expiresIn: '24hrs' }
      );
      return res.status(200).send({
        status: 200,
        message: 'successfully logged in',
        token
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        message: error.message
      });
    }
  },
  async currentUsers(req, res) {
    const user = req.user.email;
    try {
      const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [
        user
      ]);
      if (rows.length > 0) {
        return res.status(200).send({
          status: 200,
          message: 'Current user successfully retrieved',
          data: rows[0]
        });
      }
      return res.status(404).send({
        status: 404,
        message: 'Current  user not found'
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        message: error.message
      });
    }
  },
  async logout(req, res) {
    req.logOut();
    req.headers['x-auth-token'] = null;
    // req.headers['x-auth-token'] = '';
    console.log('req', req.headers['x-auth-token']);
    return res.status(401).send({
      status: 401,
      message: 'Logged out'
    });
  },
  async allUsers(req, res) {
    try {
      const text = 'SELECT * FROM users';
      const { rows } = await pool.query(text);
      return res.status(200).send({
        status: 200,
        message: 'Users successfully retrieved',
        data: rows
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        message: error.message
      });
    }
  },
  async approveUsers(req, res) {
    try {
      const userEmail = req.params.email;
      const findUser = `SELECT * FROM users WHERE email=$1 `;
      // const gottenUsers = await pool.query(findUser);
      // console.log('gootenUsers', gottenUsers);
      const foundUser = await pool.query(findUser, [userEmail]);

      if (foundUser.rowCount === 0) {
        return res.status(404).send({
          status: 404,
          message: `User with email ${req.params.email} is not found`
        });
      }
      if (foundUser.rows[0].approved) {
        return res.status(400).send({
          status: 400,
          message: `User with email ${req.params.email} is already approved`
        });
      }
      const approveUser =
        'UPDATE users SET approved=$1 WHERE email=$2 RETURNING *';
      const { rows } = await pool.query(approveUser, [
        req.body.approved,
        userEmail
      ]);
      return res.status(200).send({
        status: 200,
        message: `User with email ${req.params.email} is successfully approved`,
        data: rows
      });
    } catch (error) {
      if (error) {
        return res.status(400).send({
          status: 400,
          message: error.message
        });
      }
    }
  },
  async getAllApproved(req, res) {
    try {
      const approvedUsers = 'true';
      const approvedQuery = 'SELECT * FROM users WHERE $1=approved';
      const { rows } = await pool.query(approvedQuery, [approvedUsers]);
      return res.status(200).send({
        status: 200,
        message: 'All approved users successfully returned',
        data: rows
      });
    } catch (error) {
      return error.message;
    }
  },
  async getAllUnApproved(req, res) {
    try {
      const unApprovedUsers = 'false';
      const approvedQuery = 'SELECT * FROM users WHERE $1=approved';
      const { rows } = await pool.query(approvedQuery, [unApprovedUsers]);
      return res.status(200).send({
        status: 200,
        message: 'All unapproved users successfully returned',
        data: rows
      });
    } catch (error) {
      return error.message;
    }
  },
  async deleteOneUser(req, res) {
    const deleteQuery = 'DELETE FROM users WHERE email=$1 RETURNING *';
    try {
      const { rows } = await pool.query(deleteQuery, [req.params.email]);
      if (rows.length < 1) {
        return res.status(404).send({
          status: 404,
          message: `User with email ${req.params.email} is not found`
        });
      }
      return res.status(200).send({
        status: 200,
        message: `User with email ${req.params.email} is succesfully deleted`
      });
    } catch (error) {
      if (error) {
        return error.message;
      }
    }
  }
};
export default Users;
