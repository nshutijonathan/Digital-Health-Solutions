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
  gender VARCHAR(10) NOT NULL,
    usertype VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    approved BOOLEAN  NOT NULL DEFAULT false,
    verified BOOLEAN NOT NULL DEFAULT false,
    createdOn TIMESTAMP NOT NULL  DEFAULT NOW()
  )`;
  const Laboratories = `CREATE TABLE IF NOT EXISTS 
  laboratories(
    id SERIAL PRIMARY KEY,
    labname VARCHAR(20) NOT NULL,
    location VARCHAR(20) NOT NULL,
    doctor SERIAL NOT NULL,
    createdOn TIMESTAMP NOT NULL  DEFAULT NOW(),
    FOREIGN KEY (doctor) REFERENCES users(id) ON DELETE CASCADE 
  )
  `;
  const LaboratoriesResults = `CREATE TABLE IF NOT EXISTS
  laboratoriesResults(
    id SERIAL PRIMARY KEY,
    patientId SERIAL NOT NULL,
    labId SERIAL NOT NULL,
    doctorId SERIAL NOT NULL,
    result VARCHAR(90) NOT NULL,
    consultation VARCHAR(200) NOT NULL,
    createdOn TIMESTAMP NOT NULL  DEFAULT NOW(),
    FOREIGN KEY (patientId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (labId) REFERENCES laboratories(id) ON DELETE CASCADE,
    FOREIGN KEY (doctorId) REFERENCES users(id) ON DELETE CASCADE
  )
  `;
  const Queries = `${Users};${Laboratories};${LaboratoriesResults}`;
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
  const Laboratories = 'DROP TABLE IF EXISTS laboratories CASCADE';
  const LaboratoriesResults =
    'DROP TABLE  IF EXISTS laboratoriesResults CASCADE';
  const Queries = `${Users};${Laboratories};${LaboratoriesResults}`;
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
  const admin = `INSERT INTO users(email,firstname,lastname,password,location,gender,usertype,phone,verified,approved) VALUES('${process.env.adminEmail}','jonathan','nshuti','${hash}','kigali','male','admin','+250789083823',true,true
) ON CONFLICT DO NOTHING returning *`;
  pool
    .query(admin)
    .then(res => {
      pool.end();
    })
    .catch(err => {
      pool.end();
      console.log('error', err);
    });
};
require('make-runnable');
