import express from 'express';
import Users from '../controllers/users.controller';
import auth from '../middlewares/auth';
import admin from '../middlewares/admin';
const router = express();
router.post('/api/v1/users/register', Users.create);
router.post('/api/v1/users/register/admins', [auth, admin], Users.adminCreate);
router.post('/api/v1/users/login', Users.login);
router.get('/api/v1/users/logout', [auth], Users.logout);
router.get('/api/v1/users/me', [auth], Users.currentUsers);
router.get('/api/v1/users/all', [auth, admin], Users.allUsers);
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
export default router;
