import { model,Schema } from "mongoose";

const courseSchema=new Schema({
    title:{
        type:String,
        required: [true,"Title is required"],
        minLength: [8,"Title Must Be at least 8 Charchter"],
        maxLength: [59,"Title Must Be less than 59 Charchter"],
        trim: true
    },
    description:{
        type:String,
        required: [true,"Description is required"],
        minLength: [8,"Description Must Be at least 8 Charchter"],
        maxLength: [200,"Description Must Be less than 200 Charchter"]
    },
    category:{
        type: String,
        required:[true,"Category is required"]
    },
    thumbnail:{
        public_id:{
            type:String,
            required: true
        },
        secure:{
            type:String,
            required: true
        }
    },
    lectures:[
        {
            type:String,
            description:String,
            lecture:{
                public_id:{
                    type:String,
                    required: true
                },
                secure:{
                    type:String,
                    required: true
                }

            }
        }
    ],
    numbersOfLectures:{
        type:Number,
        default: 0
    },
    createdBy:{
        type:String,  
        required: true  
    }
    
},{
    timestamps:true
});

const Course=model("course",courseSchema);
export default Course;