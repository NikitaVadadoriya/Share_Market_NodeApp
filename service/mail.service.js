const nodemailer = require('nodemailer');
const config = require('../config');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT,
    secure: true,
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASSWORD,
    },
});

module.exports = {
    sendEmail: async (to, name, otp) => {

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: `${to}`,
            subject: 'Share Market App',
            html: `<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
            </head>
            <style>
                body {
                    font-family: 'Ubuntu', sans-serif;
                    background-color: #f5f5f5;
                }
            
                * {
                    box-sizing: border-box;
                }
            
                p:last-child {
                    margin-top: 0;
                }
            
                img {
                    max-width: 100%;
                }
            </style>
            
            <body style="margin: 0; padding: 0;">
                <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td style="padding: 20px 0 30px 0;">
                            <table align="center" cellpadding="0" cellspacing="0" width="600" style=" border-collapse: collapse; border: 1px solid #ececec; background-color: #fff;">
                                <tr>
                                    <td>
                                        <div class="user-information" 
                                        style="padding: 25px; background-image: linear-gradient(180deg, #0c78e7, #074d8b, #094e8b)""
                                        >
                                        <h1 align="center" style="color: #fff; font-size: 35px; font-weight: 500; margin: 0 0 0.1rem 0;">Welcome to Share Market App</h1>
                                        <p align="center" style="color: #fff; font-size: 30px; font-weight: 500; margin: 0 0 0 0;">Hi, ${name} </p>
                                        </div>
                                      
                                    </td>
                                    <td></td>
                                </tr>
                                <tr style="height: 100px;">
                                    <td style="padding: 3rem 2rem 1rem 2rem;">
                                      <h2 align="center" style="color: #585d6a; font-size: 30px; ">One Time Password (OTP)/h2>
                                      <p align="center" style="color: #585d6a; font-size: 14px; margin: 2.50rem 0 2rem 0;">Please find below your one time passcode.</p>
                                      <h6 align="center" style="font-size: 40px; color: #585d6a; margin: 0;  margin-top: 0;">OTP : ${otp}</h6>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="">
                                      <p align="center" style="color: #585d6a; font-size: 14px; margin: 0;"> OTP valid For 10 Minutes.
                                                     </p>
                                    </td>
                                </tr>
                                
                                                             <tr>
                                    <td style="padding: 2rem;">
                                      <p align="center" style="color: #585d6a; font-size: 14px; margin: 0;">
                                                     </p>
                                    </td>
                                </tr>
                              
                        
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>`,
        };

        try {
            await transporter.sendMail(mailOptions);
            return otp;
        } catch (error) {
            console.log("mail sending wrror", error);
            return new Error("mail not sent, plase try again later");
        }
    },
}