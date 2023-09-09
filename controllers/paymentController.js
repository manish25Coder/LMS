// import User from "../models/userModel.js";
import { razorpay } from "../server.js";
import AppError from "../utils/errorUtil.js";

export const getRazorpayApiKey=async (req,res,next)=>{
    try{
        res.status(200).json({
            success:true,
            message:'Razorpay API Key',
            key:process.env.RAZORPAY_KEY_ID
        })
    }catch(err){
        return next(
            new AppError(err.message,500)
        )
    }
    
}

export const buySubscription=async (req,res,next)=>{
    try{
        const {id}=req.user;
    const user=await User.findById(id)

    if(!user){
        return next(
            new AppError('Unauthorized,please login')
        )
    }

    if(user.role=== 'ADMIN'){
        return next(
            new AppError('Admin cannot purchase a subcriptions',400)
        )
    }

    const subcription=await razorpay.subcriptions.create({
        plain_id:process.env.RAZORPAY_PLAN_ID,
        customer_notify:1
    });

    user.subcription.id=subcription.id;
    user.subcription.status=subcription.status;

    await user.save()

    res.status(200).json({
        success:true,
        message:'Subscribed Successfully',
        subcription_id:subcription_id
    })
    }catch(err){
        return next(
            new AppError(err.message,500)
        )
    }
    
}


export const verifySubscription=async (req,res,next)=>{
    try{
        const {id}=req.user
    const {razorpay_payment_id,razorpay_signature,razorpay_subscription_id}=req.body

    const user=await User.findById(id)

    if(!user){
        return next(
            new AppError('Unauthorized,please login')
        )
    }

    const subcriptionId=user.subcription.id;

    const generatedSignature=crypto
        .createHmac('sha256',process.env.RAZORPAY_SECRET)
        .update(`${razorpay_payment_id}|${subcriptionId}`)
        .digest('hex');
    if(generatedSignature !== razorpay_signature){
        return next(
            new AppError('Payment not verfiy please try again',500)
        )
    }

    await Payment.create({
        razorpay_payment_id,
        razorpay_signature,
        razorpay_subscription_id
    })

    user.subscription.status='active';
    await user.save();

    res.status(200).json({
        success:true,
        message:'payment verified  Successfully',
        subcription_id:subcription_id
    })
    }catch(err){
        return next(
            new AppError(err.message,500)
        )
    }
    
}


export const cancelSubscription=async (req,res,next)=>{

    try{
        const {id}=req.user;

    const user=await User.findById(id)

    if(!user){
        return next(
            new AppError('Unauthorized,please login')
        )
    }

    if(user.role=== 'ADMIN'){
        return next(
            new AppError('Admin cannot purchase a subcriptions',400)
        )
    }

    const subcriptionId=user.subcription.id

    const subcription=await razorpay.subcriptions.cancle(
        subcriptionId
    )

    user.subcription.status=subcription.status;

    await user.save();
    }catch(err){
        return next(
            new AppError(err.message,500)
        )
    }
    

}



export const allPayments=async (req,res,next)=>{
    const{count}=req.query;

    const subcriptions=await razorpay.subcriptions.all({
        count: count || 10,
    })

    res.status(200).json({
        success:true,
        message:'all payments',
        subcriptions
    })
}




