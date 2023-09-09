import { Router } from "express";
import { addLectureToCourseById, createCourse, getAllCourses, getLectureByCourseId, removeCourse, updateCourse } from "../controllers/courseController.js";
import { authorizeSubscriber, authorizedRoles, isLoggedIn } from "../middleware/authMiddleware.js";
import upload from '../middleware/multerMiddleware.js'

const router=Router();

// router.get('/',getAllCourses);

router.route('/')
    .get(isLoggedIn,authorizeSubscriber,getAllCourses)
    .post(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        upload.single('thumbnail'),
        createCourse
        )
    

router.route('/:id')
    .get(isLoggedIn,getLectureByCourseId)
    .put(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        updateCourse
        )
    .delete(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        removeCourse
        )
    .post(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        upload.single('lecture'),
        addLectureToCourseById
        )
export default router;




