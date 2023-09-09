import nodemailer from "nodemailer";

const sendEmail = async function(email, subject, message){
    //creating reusable transport obj using default SMTP port
    let transport=nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure:false,//True for 456 and false for other ports
        auth:{
            user:process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },

    });

    //send mail with defined transport Object
    await transport.sendMail({
        from: process.env.SMTP_FROM_EMAIL,//sender Addresss
        to:email,//user email
        subject:subject,//subject line
        html:meaasge,//html body

    })
}

export default sendEmail;