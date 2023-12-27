import mongoose from 'mongoose'
import {config} from 'dotenv'
config()

mongoose.set("strictQuery",false)//if we are asking for extra data to access i.e is not present in them not through error skips it

const connectionToDB =async ()=>{
    try{
        const {connection}=await mongoose.connect( 
            process.env.MONGO_URI  || `mongodb+srv://<clusterusername>:<clusterpassword>@cluster0.lzjm4un.mongodb.net/LMS`
            )
    if(connection){
        console.log(`connected to DataBase ${connection.host}`);
    }
    }catch(err){
        console.log(err);
        process.exit(1);//kil the terminal 
    }   
}
export default connectionToDB;
