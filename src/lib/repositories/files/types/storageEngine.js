//@ts-check
const Cloudinary  = require('cloudinary').v2;


/**
 * 
 * @param {Cloudinary} cloudinary 
 */
function StorageEngine (cloudinary) {
    this.cloudinary = cloudinary
}

StorageEngine.prototype._handleFile = function _handleFile (_req, file, cb) {
    file.stream.pipe(this.cloudinary.uploader.upload_stream({ resource_type: "auto" }, function (error, result) {
        if (error) {
            return cb(error);
        }
        cb(null, {
            filePath: result.url
        });
    }));                        
}

StorageEngine.prototype._removeFile = function _removeFile (_req, file, cb) {
    this.cloudinary.uploader.destroy(file.filename, function (error, result) {
        if (error) {
            return cb(error);
        }
        cb(null, result);
    });
}

module.exports = StorageEngine;