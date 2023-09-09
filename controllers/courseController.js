import Course from "../models/courseModel.js"
import AppError from "../utils/errorUtil.js";
import fs from "fs/promises";
import cloudinary from 'cloudinary'

const getAllCourses=async function(req,res){

    try{
        const courses=await Course.find({}).select('-lectures');

    res.status(200).json({
        success:true,
        message:"All courses",
        courses,
    })

    }catch(err){
        return next(new AppError(e.message,500))
    }
    
}

const getLectureByCourseId=async function(req,res){
    try {
        const {id}=req.params;
        console.log('Course ID>',id);

        const course=await Course.findById( id );
        console.log('Course Details>',course);

        if(!course){
            return next(new AppError('Course not found',400))
        }
        res.status(200).json({
            success:true,
            message:"Courses Lectures fecthed successfully",
            lecture:course.lectures
        })

    } catch(err){
        return next(new AppError(err.message,500))
    }
}





const createCourse = async (req, res, next)=>{
    try {
    const { title, description, category, createdBy } = req.body;

    if ( !title || !description || !category || !createdBy) {
            return next(
                new AppError("Inavlid course id", 400)
            )      
    }

    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail: {
            public_id: "Dummy",
            secure_url: "Dummy"
        }
    });

    if(!course){
        return next(
            new AppError("Course could not created, please try again", 400)
        ) 
    }

    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder: "lms"
            });
            if (result) {
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;
            }
            fs.rm(`uploads/${req.file.filename}`); 
        }
         catch (e) {
            return next(
                new AppError(e.message, 500)
                )
        }
    }   

    await course.save();

    res.status(200).json({
        success: true,
        message: "Course created successfully",
        course
    });
    } catch (e) {
        return next(
            new AppError(e.message, 500)
            )
    }
    
}




const updateCourse=async (req,res,next)=>{

    try{
        const {id}=req.params
        const course=await Course.findByIdAndUpdate(
            id,{
                $set:req.body
            },{
                runValidators:true//check validation of new data
            }
        )

        if(!course){
            return next(new AppError("course with given id does not exist",400))
        }

        res.status(200).json({
            success:true,
            message:'Course updated successfully',
            course    
      })

    }catch(err){
        return next(new AppError(err.message,500))
    }
}


const removeCourse=async (req,res,next)=>{

    try{
        const {id}=req.params
        const course=await Course.findById(id)

        if(!course){
            return next(new AppError("course with given id does not exist",400))
        }

        await course.findByIdAndDelete(id);
        res.status(200).json({
            success:true,
            message:'Course deleted successfully',
            course    
      })

    }catch(err){
        return next(new AppError(err.message,500))
    }
}


const  addLectureToCourseById=async(req,res,next)=>{
    try{
        const {title,description}=req.body
    const {id}=req.params

    
    if ( !title || !description || !category || !createdBy) {
        return next(
            new AppError("Inavlid course id", 400)
        )      
    }

    const course=await Course.findById(id)

    if(!course){
        return next(new AppError("course with given id does not exist",400))
    }

    const lectureData={
        title,description,
        lecture:{}
    };

    if(req.file){
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder: "lms"
            });
            if (result) {
                lectureData.lecture.public_id = result.public_id;
                lectureData.lecture.secure_url = result.secure_url;
            }
            fs.rm(`uploads/${req.file.filename}`); 
        }
         catch (e) {
            return next(
                new AppError(e.message, 500)
                )
        }
    }   

    console.log('lecture >',JSON.stringify(lectureData));
    
    course.lectures.push(lectureData);

    course.numbersOfLectures=course.lectures.length;

    await course.save();

    res.status(200).json({
        success:true,
        message:'lecture  successfully added to your course',
        course    
  })

    }
    catch(err){
        return next(
            new AppError(e.message, 500)
            )
    }
    
}
export{
    getAllCourses,
    getLectureByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById
}