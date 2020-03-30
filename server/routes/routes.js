import express from 'express';
import Users from '../controllers/users.controller';
import Labs from '../controllers/labs.controller';
import auth from '../middlewares/auth';
import admin from '../middlewares/admin';
import signup from '../validations/users';
import labsValidation from '../validations/labs';

const router = express();
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

router.post('/api/v1/labs/create', [labsValidation], Labs.create);
router.get('/api/v1/labs/all', Labs.allLabs);
export default router;
