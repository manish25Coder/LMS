import { Schema,model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema({
    fullName: {
        type:"String",
        required:[true,"Name is Required"],
        minLength:[5,"Name Must Be at least 5 Charchter"],
        maxLength:[50,"Name Must Be less than 50 Charchter"],
        lowercase:true,
        trim:true
    },
    email: {
        type:"String",
        lowercase:true,
        trim:true,
        unique:true
    },
    password: {
        type:"String",
        required:[true,"Password is Required"],
        minLength:[8,"Password Must be at least 8 Characters"],
        select:true
    },
    avatar: {
        public_id: {
            type:"String"
        },
        secure_url: {
            type:"String"
        }
    },   
    role: {
        type: "String",
        enum:["USER","ADMIN"],
        default: "USER"
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    subscription:{
        id: String,
        status: String
    }
},
{
    timestamps: true
});


userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods = {
    generateJWTToken: async function(){
        return await jwt.sign(
            { id: this._id, email: this.email, subscription: this.subscription, role: this.role },
            process.env.JWT_SECRET,
            {
                expiresIn: 1200,
            }
        )
    },
    comparePassword: async function(plainTextPassword){
        return await bcrypt.compare(plainTextPassword, this.password)
    },
    generatePasswordResetToken: async function(){
        const resetToken = crypto.randomBytes(20).toString("hex");

        this.forgotPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex")
        ;    
        this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;  //15 min from now

        return resetToken;
    }
}
const User = model("User",userSchema);
export default User;