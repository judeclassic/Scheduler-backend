//@ts-check

class FileUploader {
    /**
     * 
     * @param {{cloud_name: String, api_key: String, api_secret: String, secure: boolean}} param0 
     */
    constructor ({cloud_name, api_key, api_secret, secure}) {
        this.cloudinary  = require('cloudinary').v2;
        this.multer = require('multer');

        const StorageEngine = require('./types/storageEngine');
        
        this.cloudinary.config({
            cloud_name,
            api_key,
            api_secret,
            secure
        });

        this.storage = new StorageEngine(this.cloudinary);

    }

    multipleUploader = ({fields}) => {
        return this.multer({ storage: this.storage }).fields(fields);
    }

    universalUploader = () => {
        return this.multer({ storage: this.storage }).any();
    }
    
    singleUploader = ({fileField}) => {
        return this.multer({ storage: this.storage }).single(fileField);
    }

    arrayUploader = ({fileField}) => {
        return this.multer({ storage: this.storage }).array(fileField);
    }

    deleteFile = (fileName) => {
        this.cloudinary.uploader.destroy(fileName);
    }
}


module.exports =  FileUploader;