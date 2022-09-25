//@ts-check
const BaseEntity = require("../_base");

class UserEntity extends BaseEntity {
    constructor() {
        super();
        this.strongChecked = true;
    }

    validateUserBeforeLogin = ({ email, password }) => {
        try {
            const error = [];

            const emailValidity = this._validateEmail(email);
            if (!emailValidity.status) {
                error.push(emailValidity.messages)
            }

            const passwordValidity = this._validatePassword(password);
            if (!passwordValidity.status) {
                error.push(passwordValidity.messages)
            }

            if (error.length !== 0){
                return {
                    status: false,
                    error,
                }
            }

            return {
                status: true,
                data: {...emailValidity.data, ...passwordValidity.data}
            }

        } catch(err) {
            console.log(err);
            return {
                status: false,
                data: 'Error when validating Data'
            }
        }
    }

    validateUserBeforeRegistration = ({ name, email, password, country, countries, city, cities }) => {
        try {
            const error = [];

            const nameValidity = this._validateName(name);
            if (!nameValidity.status) {
                error.push(nameValidity.messages)
            }

            const emailValidity = this._validateEmail(email);
            if (!emailValidity.status) {
                error.push(emailValidity.messages)
            }

            const passwordValidity = this._validatePassword(password);
            if (!passwordValidity.status) {
                error.push(passwordValidity.messages)
            }

            const countryValidation = this._validateCountry(country, countries);
            if (!countryValidation.status) {
                error.push(countryValidation.messages)
            }

            const cityValidation = this._validateCity(city, cities);
            if (!cityValidation.status) {
                error.push(cityValidation.messages)
            }

            if (error.length !== 0){
                return {
                    status: false,
                    error,
                }
            }

            return {
                status: true,
                data: { ...nameValidity.data , ...emailValidity.data, ...passwordValidity.data, ...countryValidation.data, ...cityValidation.data }
            };

        } catch(err) {
            console.log(err);
            return {
                status: false,
                data: 'Error when validating Data'
            };
        }
    }

    validateUserSettingEntries = ({userId, name, email }) => {
        try {
            const error = [];

            const idValidity = this._validateID(userId);
            if (!idValidity.status) {
                error.push(idValidity.messages)
            }

            const nameValidity = this._validateName(name);
            if (!nameValidity.status && name) {
                error.push(nameValidity.messages)
            }

            const emailValidity = this._validateEmail(email);
            if (!emailValidity.status && email) {
                error.push(emailValidity.messages)
            }

            if (error.length !== 0){
                return {
                    status: false,
                    error,
                }
            }

            return {
                status: true,
                data: { ...nameValidity.data , ...emailValidity.data }
            };

        } catch(err) {
            console.log(err);
            return {
                status: false,
                error: 'Error when validating Data'
            };
        }
    }

    validateApiSettingEntries = ({userId, webHooks, secretKey}) => {
        try {
            const error = [];

            const idValidity = this._validateID(userId);
            if (!idValidity.status) {
                error.push(idValidity.messages)
            }

            if (webHooks && webHooks.length !== 0) {
                webHooks.map((entry) => {
                    let linkValidity = this._validateLinkWithLocalHost(entry.value);
                    if (error.length !== 0 || !linkValidity.status) {
                        error.push(linkValidity.messages);
                    }
                    let nameValidity = this._validateSingleName(entry.value);
                    if (error.length !== 0 || !nameValidity.status) {
                        error.push(nameValidity.messages);
                    }
                })
            }

            console.log("WebHooks: " + webHooks)
            
            const secretKeyValidity = this._validateKey(secretKey);
            if (!secretKeyValidity.status && secretKey) {
                error.push(secretKeyValidity.messages)
            }

            if (error.length !== 0){
                return {
                    status: false,
                    error,
                }
            }

            return {
                status: true,
                data: { secretKey, webHooks }
            };

        } catch(err) {
            console.log(err);
            return {
                status: false,
                data: 'Error when validating Data'
            };
        }
    }

    secureResponse = (data) => {
        return {...data, password: undefined }
    }

    secureResponseWithToken = (data, token) => {
        return {...data, token, password: undefined }
    }
    
}

module.exports = UserEntity;