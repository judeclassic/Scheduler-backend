//@ts-check

const Authorization = require("../../../lib/repositories/auth-enc");
const TemplateModel = require("../../../lib/repositories/DB/model/template");
const TemplateEntity = require("../../entities/template");

class UserService {
    /**
     * 
     * @param {{ authenticationRepo: Authorization, templateDBRepo: TemplateModel, templateEntity: TemplateEntity, logger: any}} param0 
     */

    constructor({ authenticationRepo, templateDBRepo, templateEntity, logger }) {
        this.templateDBRepo = templateDBRepo;
        this.templateEntity = templateEntity;
        this.authenticationRepo = authenticationRepo;
        this.logger = logger;
    }

    createTemplate = async ({userId, templateId, templateName, templateLink}) => {
        try {
            const value = { userId, templateName, templateId, templateLink }

            const validatedData = this.templateEntity.validateBeforeCreation(value);
            if (!validatedData.status || !validatedData.data) {
                return {
                    status: false,
                    error: validatedData.error
                };
            }

            const ifItExist = await this.templateDBRepo.checkIfExist({ name: templateName });

            if (ifItExist.status === true) return {status: false, error: 'name exist please use another name'};

            if (typeof(validatedData.data) === 'string') return {status: false, error: 'invalid data after validation'};
            
            let template = await this.templateDBRepo.saveTemplateToDB(validatedData.data);

            if (!template || template.status === false) {
                return {status: false, error: 'could not save data'};
            }

            return {status: true, message: 'Created Succesfully', data: template };
        } catch (error) {
            console.log(error);
            return {status: false, error};
        }
    }

    getTemplate = async ({userId}) => {
        const validated = this.templateEntity._validateID(userId);
        if (!validated.status || !validated.data) {
            return {
                status: false,
                error: validated.messages
            };
        }
        const { id } = validated.data;
        const response = await this.templateDBRepo.getAllTemplates({ userId: id });
        if ( response.status === false ) {
            return {status: false, error: ''}
        }
        if (response) {
            return {
                status: true,
                message: 'Template Fetched SuccessFully',
                data: response.data
            }
        }
    }

    updateTemplate = async ({userId, templateId, templateName, templateLink}, deletePreviousFile) => {
        try {
            const unValidatedData = { userId, templateName, templateId, templateLink };
            console.log(unValidatedData.data);

            const validated = this.templateEntity.validateBeforeCreation(unValidatedData);
            if (!validated.status || !validated.data) {
                return {
                    status: false,
                    error: validated.error
                };
            }
            if (typeof(validated.data) === 'string') return {status: false, error: 'invalid data after validation'};

            let ifItExist = await this.templateDBRepo.checkIfIdExist(templateId);
            if (!ifItExist || ifItExist.status === false) {
                console.log('thia should exist before')
                ifItExist = await this.templateDBRepo.checkIfExist({id: templateId});
            }

            console.log(' the data exists', ifItExist);

            let template;
            
            if (ifItExist.status === true) {
                if (ifItExist.data.link) deletePreviousFile(ifItExist.data.link);

                template = await this.templateDBRepo.updateTemplateDetailWithIDToDB(templateId, validated.data);
                if (!template || template.status === false) {
                    template = await this.templateDBRepo.updateTemplateDetailToDB({id: templateId}, validated.data);
                }
            } else {
                template = await this.templateDBRepo.saveTemplateToDB(validated.data);
            }

            console.log(' the template has been updated', template);

            if (!template || template.status === false) {
                return {status: false, error: 'could not save data to DB after validation'};
            }

            return {status: true, message: 'Created Succesfully', data: template };
        } catch (error) {
            console.log(error);
            return {status: false, error}
        }
    }

    deleteTemplate = async ({templateId}, deletePreviousFile) => {
        try {
            const validated = this.templateEntity._validateID(templateId);

            if (!validated.status || !validated.data) {
                return {
                    status: false,
                    error: validated.messages
                };
            }
            if (typeof(validated.data) === 'string') return {status: false, error: 'invalid data after validation'};

            const ifItExist = await this.templateDBRepo.checkIfIdExist(validated.data.id);

            let template;
            
            if (ifItExist.status === true) {
                deletePreviousFile(ifItExist.data.link);
                template = await this.templateDBRepo.deleteTemplateDetailFromDB(templateId);
            }

            if (!template || template.status === false) {
                return {status: false, error: 'could not delete data'};
            }
            return {status: true, message: 'Deleted Succesfully', data: template };
        } catch (error) {
            console.log(error);
            return {status: false, error}
        }
    }
}

module.exports = UserService;