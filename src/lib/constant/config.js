require('dotenv').config();

module.exports = {
    name: "Scheduler",
    server: {
        port: process.env.PORT || 8080
    },
    db: {
        url: process.env.MONGODB_URL
    },
    file: {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    },
    auth: {
        userAuthKey: process.env.USER_AUTHENTICATION_KEY
    }
}