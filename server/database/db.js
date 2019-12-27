import bcrypt from 'bcrypt';
import pool from './connect';

export const CreateTables = () => {
  const Users = `CREATE TABLE IF NOT EXISTS 
	users(
	id SERIAL PRIMARY KEY,
	email VARCHAR(30) UNIQUE NOT NULL,
	firstname VARCHAR(20) NOT NULL,
	lastname VARCHAR(20) NOT NULL,
	password VARCHAR(300) NOT NULL ,
	location VARCHAR(20) NOT NULL,
    usertype VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    approved BOOLEAN  NOT NULL DEFAULT false,
    verified BOOLEAN NOT NULL DEFAULT false,
    createdOn TIMESTAMP NOT NULL  DEFAULT NOW()
	)`;
  const Queries = `${Users}`;
  pool
    .query(Queries)
    .then(res => {
      pool.end();
      console.log(res);
    })
    .catch(err => {
      pool.end();
      console.log(err);
    });
};
export const Droptables = () => {
  const Users = 'DROP TABLE IF EXISTS users CASCADE';
  const Queries = `${Users}`;
  pool
    .query(Queries)
    .then(res => {
      pool.end();
      console.log(res);
    })
    .catch(err => {
      pool.end();
      console.log(err);
    });
  pool.on('removed', () => {
    process.exit(0);
  });
};
export const AdminIndex = () => {
  const hash = bcrypt.hashSync(process.env.adminPassword, 8);
  const admin = `INSERT INTO users(email,firstname,lastname,password,location,usertype,phone,verified,approved) VALUES('${process.env.adminEmail}','jonathan','nshuti','${hash}','kigali','admin','+250789083823',true,true
) ON CONFLICT DO NOTHING returning *`;
  pool
    .query(admin)
    .then(res => {
      pool.end();
    })
    .catch(err => {
      pool.end();
    });
};
require('make-runnable');
