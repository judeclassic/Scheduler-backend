//@ts-check
const nodeMailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const DEFAULT_FROM_EMAIL = process.env.DEFAULT_FROM_EMAIL
const DEFAULT_SES_PASSWORD = process.env.DEFAULT_SES_PASSWORD;
const DEFAULT_NAME = "Scheduler";

class Mailer {
    constructor(){
        this.initAmazon();
    }

    initAmazon = async ()=>{
        this.transporter = nodeMailer.createTransport({
            pool: true,
            maxConnections: 1,
            host: process.env.DEFAULT_SES_HOST,
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.DEFAULT_SES_USER,
                pass: DEFAULT_SES_PASSWORD, // generated ethereal password
            },
        });
    }

    async sendEmail(message) {
        try {
            const res =  await this.transporter.sendMail({...message, from: `${DEFAULT_FROM_EMAIL} ${DEFAULT_NAME}`});
        } catch (error) {
            console.error("Sending Email failed");
            console.error(error);
            return error;
        }
    }

    async sendReminderEmail(to, message, source) {
        const { name, subject } = message;
        let htmlContent = fs.readFileSync(path.join(__dirname, '../../../../public/emails/reminder-mail.html')).toString();
        htmlContent = htmlContent.replace('{{name}}', name);
         
        const MAIL_CONTENT = {
            to: to, // list of receivers
            subject: subject, // Subject line
            html: htmlContent, // html body
        }
        
        return this.sendEmail(MAIL_CONTENT);
     }
}

module.exports = Mailer;
