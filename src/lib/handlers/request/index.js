//@ts-check
const _BaseHandler = require('../_base');
const FileRepo = require('../../../lib/repositories/files')
const AuthRepo = require('../../../lib/repositories/auth-enc');

class RequestHandler extends _BaseHandler{
    /**
     * 
     * @param {{fileRepo: FileRepo, authenticationRepo: AuthRepo, route: {get: Function, post: Function, put: Function, delete: Function}}} param0
     */

    constructor({fileRepo, authenticationRepo, route}) {
        super({ route })
        this.fileRepo = fileRepo;
        this.authenticationRepo = authenticationRepo;
    }
    /**
     * 
     * @returns {(req: any, res: any, next: Function) => void}
     */

    _authenticate = () => {
        return (req, res, next) => {
            const response = this.authenticationRepo.verifyBearerToken(req.headers["authorization"]);
            if ( response.status === false ) {
                return res.status(403).json({
                    status: response.status,
                    noToken: true,
                    error: response.error,
                });
            }
            req.user = response.data;
            return next();
        }
    }

    verifyKey = () => {
        return (req, res, next) => {
            const response = this.authenticationRepo.verifyBearerToken(req.headers["authorization"]);
            if ( response.status === false ) {
                return res.status(403).json({
                    status: response.status,
                    noPublicKey: true,
                    error: response.error,
                });
            }
            req.key = response.data;
            return next();
        }
    }

    /**
     * 
     * @param {String} path 
     * @param {Function} callback 
     */

    post = (path, callback) => {
        this._post(path, (req, res) => {
            const { params } = req;
            /**
             * 
             * @param {number} code
             * @param {{code: number, message: String, error: any, data: any}} data
             */
            const _send = (code, data)=> {
                return res.status(code).json(data);
            }

            return callback({ params }, _send );
        })
    }

    /**
     * 
     * @param {String} path 
     * @param {Function} callback 
     */

    postWithBody = (path, callback) => {
        this._post(path, (req, res) => {
            const { params, body } = req;
            /**
             * 
             * @param {number} code
             * @param {{code: number, message: String, error: any, data: any}} data
             */
            const _send = (code, data)=> {
                res.status(code).json(data);
            }

            return callback({ params, body }, _send );
        })
    }


    /**
     * 
     * @param {String} path 
     * @param {Function} callback 
     */
    postWithBodyAndKey = (path, callback) => {
        this._post(path, this.verifyKey(), (req, res) => {
            const { params, body, key } = req;
            
            /**
             * 
             * @param {number} code
             * @param {{code: number, message: String, error: any, data: any}} data
             */
            const _send = (code, data)=> {
                res.status(code).json(data);
            }

            return callback({ params, body, key }, _send );
        });
    }


    /**
     * 
     * @param {String} path 
     * @param {Function} callback 
     */
    getWithAuth = (path, callback) => {
        this._get(path, this._authenticate(), (req, res) => {
            const { params, user } = req;
            
            /**
             * 
             * @param {number} code
             * @param {{code: number, message: String, error: any, data: any}} data
             */
            const _send = (code, data)=> {
                res.status(code).json(data);
            }

            return callback({ params, user }, _send);
        })
    }

    /**
     * 
     * @param {String} path 
     * @param {Function} callback 
     */
    
     postWithBodyAndAuth = (path, callback) => {
        this._post(path, this._authenticate(), (req, res) => {
            const { params, body, user } = req;
            
            /**
             * 
             * @param {number} code
             * @param {{code: number, message: String, error: any, data: any}} data
             */
            const _send = (code, data)=> {
                res.status(code).json(data);
            }

            return callback({ params, body, user }, _send);
        })
    }


    /**
     * 
     * @param {String} path 
     * @param {String} fileField
     * @param {Function} callback 
     */
    postWithFiles = (path, fileField, callback) => {
        const fileHandler = this.fileRepo.singleUploader({fileField})
        this._post(path, fileHandler, (req, res) => {
            const { params, body } = req;
            
            const image = req.files.map(file => file.imagePath);
            /**
             * 
             * @param {number} code
             * @param {{code: number, message: String, error: any, data: any}} data
             */
            const _send = (code, data)=> {
                res.status(code).json(data);
            }

            return callback({ params, body, image }, _send );
        })
    }

    /**
     * 
     * @param {String} path 
     * @param {Function} callback 
     */
    postWithAuthAndFile = (path, callback) => {
        const fileHandler =  this.fileRepo.universalUploader();
        this._post(path, this._authenticate(), fileHandler, (req, res) => {
            const { params, body, user } = req;
            
            let file = ''
            if (req.files) {
                file = req.files.map(f => f.filePath)[0];
            }
            /**
             * 
             * @param {number} code
             * @param {{code: number, message: String, error: any, data: any}} data
             */
            const _send = (code, data)=> {
                res.status(code).json(data);
            }
            const _deleteFile = this.fileRepo.deleteFile;

            return callback({ params, body, user, file }, _send, _deleteFile );
        })
    }

    deleteWithAuthAndFile = (path, callback) => {
        this._delete(path, this._authenticate(), (req, res) => {
            const { params, body, user } = req;
        
            /**
             * 
             * @param {number} code
             * @param {{code: number, message: String, error: any, data: any}} data
             */
            const _send = (code, data)=> {
                res.status(code).json(data);
            }
            const _deleteFile = this.fileRepo.deleteFile;

            return callback({ params, body, user }, _send, _deleteFile );
        })
    }
}

module.exports = RequestHandler;