//@ts-check
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const uuid = require('uuid').v4;

class Authorization {
    /**
     * 
     * @param {{key: String}} param0
     */

    constructor({key}) {
        this.key = key;
        this.jwt = jwt;
        this.uuid = uuid;
        this.bcrypt = bcrypt;
    }

    encryptToken = (data) => {
        return this.jwt.sign(data, this.key, { expiresIn: 1000 * 60 * 60 * 24 * 7,});
    }

    decyyptToken = (data) => {
        return this.jwt.decode(data);
    }

    createSpecialKey = ({prefix='', suffix='', removeDashes=false}) => {
        const secretKey = this.uuid().split('_').join('');
        if (removeDashes ) {
            const secretKeyWithDashes = secretKey.split('_').join('');
            return `${prefix}${secretKeyWithDashes}${suffix}`;
        }
        return `${prefix}${secretKey}${suffix}`;
    }


    verifyBearerToken = (data) => {
        if (data === null || data === undefined) {
            return { status: false, error: 'Authentication Failed'};
        }
        try {
            const token = data.split(" ",2)[1];
            const decoded = this.jwt.verify(token, this.key);
            data = decoded;
            return {status: true, data};
        }
        catch (error) {
            return { status: false, error: 'Authentication Failed' };
        }
    }

    encryptPassword = (password) => {
        return this.bcrypt.hashSync(password, 10);
    }

    comparePassword = ({ password, userPassword }) => {
        return this.bcrypt.compareSync(password, userPassword)
    }
}

module.exports = Authorization;