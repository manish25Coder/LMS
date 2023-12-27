import { Router } from "express";
import { addLectureToCourseById, createCourse, getAllCourses, getLecturesByCourseId, removeCourse, updateCourse, removeLecture } from "../controllers/courseController.js";
import { authorizedRoles, authorizedSubscriber, isLoggedIn } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router = Router();
router.route("/")
    .get(getAllCourses)
    .post(
        isLoggedIn,
        authorizedRoles("ADMIN"),
        upload.single("thumbnail"),
        createCourse)
    .delete(
            isLoggedIn,
            authorizedRoles("ADMIN"),
            removeLecture
        )
router.route("/:id")
    .get(
        isLoggedIn,
        authorizedSubscriber,
        getLecturesByCourseId
    )
    .put(
        isLoggedIn,
        authorizedRoles("ADMIN"),
        updateCourse
    )
   
    .post(
        isLoggedIn,
        authorizedRoles("ADMIN"),
        upload.single("lecture"),
        addLectureToCourseById
    )
    .delete(
        isLoggedIn,
        authorizedRoles("ADMIN"),
        removeCourse
    )

export default router;