import {Router} from 'express';
import { isLoggedIn } from '../middleware/authMiddleware.js';
import { register,login,logout,getProfile,forgotPassword ,resetPassword, changePassword, updateUser} from '../controllers/userController.js';
import upload from '../middleware/multerMiddleware.js';

const router=Router();

router.post('/register',upload.single("avatar"),register);
router.post('/login',login);
router.get('/logout',logout);
router.get('/me',isLoggedIn,getProfile)
router.post('/reset',forgotPassword)
router.post('/reset/:resetToken',resetPassword)
router.post('/changed-password',isLoggedIn,changePassword)
router.put('/update',isLoggedIn,upload.single("avatar"),updateUser)


export default router;