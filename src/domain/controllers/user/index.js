//@ts-check
const BaseController = require('../_base/base')

const RequestHandler = require("../../../lib/handlers/request");
const UserService = require("../../services/user");
const TemplateService = require("../../services/template");

class UserController extends BaseController {

    /**
    * @param {{userService: UserService, templateService: TemplateService, requestHandler: RequestHandler}} param
    */

    constructor({userService, templateService, requestHandler}){
        super({host: '/v1/api/user'});
        this.userService = userService;
        this.template = templateService
        this.requestHandler = requestHandler;
        this.requestHandler._addHost(this._host)
    }

    register = async () => {
        return this.requestHandler.postWithBody('/sign-up', async ({ body}, send) => {
            const response = await this.userService.registerUserToDB(body);
            console.log(response)
            if (response.status)
                return send(200, {
                    status: true,
                    message: response.message,
                    user: response.data
                });
            else
                return send(403, {
                    status: false,
                    error: response.error,
                });
        });
    }

    login = async () => {
        return this.requestHandler.postWithBody('/sign-in', async ({ body}, send) => {
            const response = await this.userService.verifyUserLoginFormDB(body);
            if (response.status) 
                return send(200, {
                    status: true,
                    message: response.message,
                    user: response.data
                });
            else
                return send(403, {
                    status: false,
                    error: response.error,
                });
            
        });
    }

    getUser = async () => {
        return this.requestHandler.getWithAuth('/', async ({ user }, send) => {
            const { id } = user;

            const response = await this.userService.getUserInfoFromDB({userId: id});
            if (response.status)
                return send(200, {
                    status: true,
                    message: response.message,
                    user: response.data
                });
            else
                return send(403, {
                    status: false,
                    error: response.error,
                });
            
        });
    }

    createTemplate = async () => {
        return this.requestHandler.postWithBodyAndAuth('/template/create', async ({ user, body }, send) => {
            const { id } = user;
            const response = await this.template.createTemplate({userId: id, ...body });
            if (response.status)
                return send(200, {
                    status: true,
                    message: response.message,
                    user: response.data
                });
            else
                return send(403, {
                    status: false,
                    error: response.error,
                });
            
        });
    }

    getTemplate = async () => {
        return this.requestHandler.getWithAuth('/template/', async ({ user, params }, send) => {
            const { id } = user;

            const response = await this.template.getTemplate({userId: id, ...params });
            if (response.status)
                return send(200, {
                    status: true,
                    message: response.message,
                    template: response.data
                });
            else
                return send(403, {
                    status: false,
                    error: response.error,
                });
        });
    }

    updateTemplate = async () => {
        return this.requestHandler.postWithAuthAndFile('/template/update', async ({ body, user, file }, send, deleteFile) => {
            const { id } = user;

            const response = await this.template.updateTemplate({userId: id, ...body, templateLink: file }, deleteFile );
            if (response.status)
                return send(200, {
                    status: true,
                    message: response.message,
                    template: response.data
                });
            else
                return send(403, {
                    status: false,
                    error: response.error,
                });
            
        });
    }

    
    deleteTemplate = async () => {
        return this.requestHandler.deleteWithAuthAndFile('/template/delete', async ({ body, user }, send, deleteFile) => {
            const { id } = user;
            
            const response = await this.template.deleteTemplate({userId: id, ...body }, deleteFile );
            if (response.status)
                return send(200, {
                    status: true,
                    message: response.message,
                    template: response.data
                });
            else
                return send(403, {
                    status: false,
                    error: response.error,
                });
            
        });
    }
    
    
    updateUserSettings = async () => {
        return this.requestHandler.postWithBodyAndAuth('/settings/updateUserSettings', async ({ body, user }, send) => {
            const { id } = user;
            console.log(body);
            const response = await this.userService.updateUserSettings({userId: id, ...body});
            if (response.status) 
                return send(200, {
                    status: true,
                    message: response.message,
                    user: response.data
                });
            else
                return send(403, {
                    status: false,
                    error: response.error,
                });
            
        });
    }

    updateApiSettings = async () => {
        return this.requestHandler.postWithBodyAndAuth('/settings/updateApi', async ({ body, user }, send) => {
            const { id } = user;
            const response = await this.userService.updateApiSettings({userId: id, ...body});
            if (response.status)
                return send(200, {
                    status: true,
                    message: response.message,
                    user: response.data
                });
            else
                return send(403, {
                    status: false,
                    error: response.error,
                });
            
        });
    }
}

module.exports = UserController;