import app from "../app.js";
import AppError from "../utils/errorUtil.js";
import Jwt  from "jsonwebtoken";

const isLoggedIn=async(req,res,next)=>{
    const {token}=req.cookies;

    if(!token){
        return next(new AppError('Unauthenticated,please login again',400))
    }

    const userDetails=await Jwt.verify(token,process.env.JWT.SECRET);

    req.user=userDetails;
    next();

}


const authorizedRoles=(...roles)=>async (req,res,next)=>{
    const currentUserRoles=req.user.role;
    if(roles.includes(currentUserRoles)){
        return next(new AppError('you do not have permission to access this route',500))
    }
    next()
}

const authorizeSubscriber=async(req,res,next)=>{
    const subcription=req.user.subscription;
    const currentUserRoles=req.user.role;

    if(currentUserRoles !== 'ADMIN' && subcription.status !=='active'){
        return next(
            new AppError('please subscribce to access this route!',403)
        )
    }
    next();
}

export{
    isLoggedIn,
    authorizedRoles,
    authorizeSubscriber
}