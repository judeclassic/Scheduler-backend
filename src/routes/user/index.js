//@ts-check

const UserController = require('../../domain/controllers/user');

const UserService = require('../../domain/services/user');
const TemplateService = require('../../domain/services/template');

const UserEntity = require('../../domain/entities/user');
const TemplateEntity = require('../../domain/entities/template');

const RequestHandler = require('../../lib/handlers/request');

const UserModel = require('../../lib/repositories/DB/model/user');
const TemplateModel = require('../../lib/repositories/DB/model/template');

const FileUploader = require('../../lib/repositories/files');
const Authorization = require('../../lib/repositories/auth-enc');

const config = require('../../lib/constant/config');

/**
 * 
 * @param {*} route 
 * @param {*} logger 
 */
const router = (route, logger) => {
    const authKey = config.auth.userAuthKey;

    const userEntity = new UserEntity();
    const templateEntity = new TemplateEntity();

    const userDBRepo = new UserModel();
    const templateDBRepo = new TemplateModel();

    const fileRepo = new FileUploader(config.file);
    const authenticationRepo = new Authorization({key: authKey});

    const userService = new UserService({ authenticationRepo, userDBRepo, userEntity, logger });
    const templateService = new TemplateService({ authenticationRepo, templateDBRepo, templateEntity, logger });

    const requestHandler = new RequestHandler({fileRepo, authenticationRepo, route});

    const userController = new UserController({userService, requestHandler, templateService});

    userController.init();
}

module.exports = router;