import express from "express";

import { Router } from "express";
import { changePassword, forgotPassword, getProfile, login, logout, register, resetPassword, updateUser } from "../controllers/userController.js";
import { isLoggedIn } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me",isLoggedIn, getProfile);
router.post("/reset", forgotPassword);
router.post("/reset-token/:resetToken", resetPassword);
router.post("/changed-password", isLoggedIn, changePassword);
router.put("/update/:id", isLoggedIn, upload.single("avatar"), updateUser);


export default router;