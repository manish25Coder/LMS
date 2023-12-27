import app from "./app.js";
import connectionToDB from "./config/dbConnection.js";
import cloudinary from "cloudinary";
import Razorpay from "razorpay";
import { config } from "dotenv";
config();

const PORT = process.env.PORT || 5000;

//cloudinary confugration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
})

// razorpay.plans.fetch(process.env.RAZORPAY_PLAN_ID);
app.listen(PORT , async() => {
    await connectionToDB()
    console.log(`App is running at http:localhost:${PORT}`);
});