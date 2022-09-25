//@ts-check
class BaseEntity {
    constructor() {
        this.strongChecked = true;
    }

    _validateEmail = (email) => {
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!email) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, messages: "Email cannot be null"});
        }
        if (!emailRegex.test(email)) {
            if (/^@/.test(email)) {
                return ({status: false, messages: "email is inValid (@ is missing)"});
            }
            return ({status: false, messages: "email is inValid"});
        }
        return ({status: true, data: {email}});
    }

    _validatePassword = (password) => {
        let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;

        if (!password ) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, messages: "Password cannot be null"});
        }
        if (!passwordRegex.test(password)) {
            if (password.length < 8) {
                return ({status: false, messages: "Password is Invalid (password must be greater than 8)"});
            }
            if (password.length > 30) {
                return ({status: false, messages: "Password is Invalid (password must be less than 30)"});
            }
            return ({status: false, messages: "Password is Invalid (password should at least 1 capital, 1 small, 1 special, and 1 number)"});
        }
        return ({status: true, data: {password}});
    }

    _validateName = (name) => {
        if (!name) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, messages: "name cannot be null"});
        }
        const names = name.split(" ");
        let firstName = names[0] || undefined;
        let surName = names[1] || undefined;
        let otherName = names[2] || undefined;

        if (!firstName) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, messages: "name cannot be null"});
        }

        return { status: true, data: {firstName, surName, otherName} }
    }

    _validateSingleName = (name) => {
        if (!name) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, messages: "name cannot be null"});
        }

        if (name < 3) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, messages: "name cannot be lest than 3 characters"});
        }

        return { status: true, data: {name} }
    }

    _validateID = (id) => {
        if (!id) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, messages: "id cannot be null"});
        }

        if ( id.length < 10 ) {
            return ({status: false, messages: "id cannot be less than 10 characters"});
        }

        if ( id.length > 40 ) {
            return ({status: false, messages: "id cannot be greater than 40 characters"});
        }

        return { status: true, data: {id} }
    }

    _validateKey = (id) => {
        if (!id) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, messages: "id cannot be null"});
        }

        if ( id.length < 20 ) {
            return ({status: false, messages: "id cannot be less than 10 characters"});
        }

        if ( id.length > 60 ) {
            return ({status: false, messages: "id cannot be greater than 60 characters"});
        }

        return { status: true, data: {id} }
    }

    _validateCountry = (country, countries) => {
        if (!country) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, messages: "Country cannot be null"});
        }
        if (!countries) {
            return ({status: false, data: {country}, message: "list of countries returned null"});
        }
        if (!(countries.find((c) => c === country ))) {
            return ({status: false, messages: "country cannot be found in the accepted list of countries"});
        }

        return ({status: true, data: {country}});
    }

    _validateCity = (city, cities) => {
        if (!city) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, messages: "City cannot be null"});
        }
        if (!cities) {
            return ({status: false, data: {city}, message: "list of cities returned null"});
        }
        if (!(cities.find((c) => c === city))) {
            return ({status: false, messages: "country cannot be found in the accepted list of cities"});
        }

        return ({status: true, data: {city}});
    }

    _validateState = (state, states) => {
        if (!state) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, messages: "Country cannot be null"});
        }
        if (!states) {
            return ({status: false, data: {state}, message: "list of countries returned null"});
        }
        if (!(states.find((s) => s === state))) {
            return ({status: false, messages: "country cannot be found in the accepted list of countries"});
        }

        return ({status: true, data: {state}});
    }

    _validateAddress = (address) => {
        let addressRegex = /d+[ ](?:[A-Za-z0-9.-]+[ ]?)+(?:Avenue|Lane|Road|Boulevard|Drive|Street|Ave|Dr|Rd|Blvd|Ln|St)\.?/;

        if (!address ) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, messages: "Address cannot be null"});
        }
        if (!addressRegex.test(address)) {
            return ({status: false, messages: "Address is Invalid "});
        }
        return ({status: true, data: {address}});
    }

    _validateLink = (link) => {
        let linkRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/

        if (!link ) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, messages: "Link cannot be null"});
        }
        if (!linkRegex.test(link)) {
            return ({status: false, messages: "Link is Invalid"});
        }
        return ({status: true, data: {link}});
    }

    _validateLinkWithLocalHost = (link) => {
        let linkRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
        let localLinkRegex = /^https?:\/\/localhost:[0-9]{1,5}\/([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/

        if (!link ) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, messages: "Link cannot be null"});
        }

        if (!linkRegex.test(link) && !localLinkRegex.test(link)) {
            return ({status: false, messages: "Link is Invalid"});
        }
        return ({status: true, data: {link}});
    }
    
    
}

module.exports = BaseEntity;