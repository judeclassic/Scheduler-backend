//@ts-check
const BaseEntity = require("../_base");

class TemplateEntity extends BaseEntity {
    constructor() {
        super();
        this.strongChecked = true;
    }

    validateBeforeCreation = ({ userId, templateName, templateId, templateLink }) => {
        try {
            const error = [];

            const userIdValidity = this._validateID(userId);
            if (!userIdValidity.status) {
                error.push(userIdValidity.messages)
            }

            const nameValidity = this._validateSingleName(templateName);
            if (!nameValidity.status) {
                error.push(userIdValidity.messages)
            }

            const templateIdValidity = this._validateID(templateId);
            if (!templateIdValidity.status) {
                error.push(templateIdValidity.messages)
            }

            const linkValidity = this._validateLink(templateLink);
            if (!linkValidity.status) {
                error.push(linkValidity.messages)
            }

            if (error.length !== 0){
                return {
                    status: false,
                    error,
                }
            }

            return {
                status: true,
                data: {userId: userIdValidity.data.id, ...nameValidity.data, ...templateIdValidity.data, ...linkValidity.data}
            }

        } catch(err) {
            console.log(err);
            return {
                status: false,
                data: 'Error when validating Data'
            }
        }
    }

    secureResponse = (data) => {
        return {...data, password: undefined }
    }
    
}

module.exports = TemplateEntity;