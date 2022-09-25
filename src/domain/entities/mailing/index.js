const BaseEntity = require("../_base");

//@ts-check
class MailingEntity extends BaseEntity {
    constructor() {
        super();
        this.strongChecked = true;
    }

    validateModel = ({ id, name, email }) => {
        try {
            let error = [];

            const idValidity = this._validateID(id);
            if (id && !idValidity.status) {
                error.push(idValidity.messages);
            }

            const emailValidity = this._validateEmail(email);
            if (!emailValidity.status) {
                error.push(emailValidity.messages);
            }

            const nameValidity = this._validateName(name);
            if (!nameValidity.status) {
                error.push(nameValidity.messages);
            }

            if (error.length !== 0){
                return {
                    status: false,
                    error,
                }
            }

            return {
                status: true,
                data: {...emailValidity.data, ...nameValidity.data}
            }

        } catch(err) {
            console.log(err);
            return {
                status: false,
                data: 'Error when validating Data'
            }
        }


    }
}

module.exports = MailingEntity;