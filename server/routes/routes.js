import express from 'express';
import Users from '../controllers/users.controller';
import Labs from '../controllers/labs.controller';
import Results from '../controllers/results.controller';
import auth from '../middlewares/auth';
import admin from '../middlewares/admin';
import signup from '../validations/users';
const router = express.Router();
router.post('/api/v1/users/register', [signup], Users.create);
router.post(
  '/api/v1/users/register/admins',
  [auth, admin, signup],
  Users.adminCreate
);
router.post('/api/v1/users/login', Users.login);
router.get('/api/v1/users/logout', [auth], Users.logout);
router.get('/api/v1/users/me', [auth], Users.currentUsers);
router.get('/api/v1/users/all', Users.allUsers);
router.delete(
  '/api/v1/users/delete/:email',
  [auth, admin],
  Users.deleteOneUser
);
router.put(
  '/api/v1/users/doctors/approve/:email',
  [auth, admin],
  Users.approveUsers
);
router.get(
  '/api/v1/users/doctors/approved',
  [auth, admin],
  Users.getAllApproved
);
router.get(
  '/api/v1/users/doctors/unapproved',
  [auth, admin],
  Users.getAllUnApproved
);

// Labs routes

router.post('/api/v1/labs/create', [auth, admin], Labs.create);
router.get('/api/v1/labs/all', [auth, admin], Labs.allLabs);
router.get('/api/v1/labs/one/:labname', [auth, admin], Labs.oneLab);
router.delete('/api/v1/labs/delete/:labname', [auth, admin], Labs.deleteLab);
router.put('/api/v1/labs/update/:labname', [auth, admin], Labs.updateLab);

// Results routes

router.post('/api/v1/results/create', [auth], Results.create);
router.get('/api/v1/results/all', [auth], Results.allResults);
router.get('/api/v1/results/one/:id', [auth], Results.oneResult);
router.delete('/api/v1/results/delete/one/:id', [auth], Results.deleteResult);
router.put('/api/v1/results/update/one/:id', [auth], Results.updateResult);
export default router;
