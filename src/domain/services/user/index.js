//@ts-check

const Authorization = require("../../../lib/repositories/auth-enc");
const UserModel = require("../../../lib/repositories/DB/model/user");
const UserEntity = require("../../entities/user");

class UserService {
    /**
     * 
     * @param {{ authenticationRepo: Authorization,userDBRepo: UserModel, userEntity: UserEntity, logger: any}} param0
     */
    constructor({ authenticationRepo, userDBRepo, userEntity, logger }) {
        this.userDBRepo = userDBRepo;
        this.userEntity = userEntity;
        this.authenticationRepo = authenticationRepo;
        this.logger = logger;
    }

    registerUserToDB = async (details) => {
        try {
            const dataBeforeValidation = { ...details, countries: [details.country], cities: [details.city] } //TODO: MAKE AN API TO GET COUNTRIES AND CITIES AND SAVE TO DB FOR PERMANENT USAGE

            const validatedData = this.userEntity.validateUserBeforeRegistration(dataBeforeValidation);

            if (!validatedData.status && !validatedData.data) return { status: false, error: validatedData.error };

            const { email }  = details;

            const ifItExist = await this.userDBRepo.checkIfExist({ email });

            if (ifItExist.status === true) return {status: false, error: 'email exist please enter another email'};

            if (typeof(validatedData.data) === 'string') return {status: false, error: 'invalid data after validation'};

            validatedData.data.password = this.authenticationRepo.encryptPassword(validatedData.data.password);

            let publicKey = await this.authenticationRepo.createSpecialKey({ prefix: '', suffix: '', removeDashes: true });
            let secretKey = await this.authenticationRepo.createSpecialKey({ prefix: 'sk_live_', suffix: ''});
            
            let user = await this.userDBRepo.saveUserToDB({...validatedData.data, publicKey, secretKey});

            if (!user || user.status === false) {
                return {status: false, error: 'could not save data'};
            }

            let secureUser = this.userEntity.secureResponse(user)

            return { status: true, message: 'Registered Succesful', data: secureUser };
        } catch (error) {
            return { status: false, error };
        }
    }

    verifyUserLoginFormDB = async (details) => {
        try {
            const validatedData = this.userEntity.validateUserBeforeLogin(details);

            if (!validatedData.status || !validatedData.data) {
                return {
                    status: false,
                    error: validatedData.error
                };
            }

            const { email, password }  = details;

            const user = await this.userDBRepo.checkIfExist({ email });

            if ( !user || user.status === false ) return {status: false, error: 'email is not found'}

            const userPassword = await user.data.password

            if (this.authenticationRepo.comparePassword({ password, userPassword })) {
                let payload = { id: user.data._id, firstName: user.data.firstName, email: user.data.email };
                let token = this.authenticationRepo.encryptToken(payload);

                let finalUser = this.userEntity.secureResponseWithToken(user, token)
                // @ts-ignore
                return { status: true, message: 'Information Fetched SuccessFully', data: finalUser };
            }
            return { status: false, error: 'password is invalid' };
            
        } catch (err) {
            console.log(err);
            return { status: false, error: 'Error could not retrieve info' };
        }
    }

    getUserInfoFromDB = async ({userId}) => {
        try {
            const data = this.userEntity._validateID(userId);
            if (!data.status || !data.data) {
                return {
                    status: false,
                    error: data.error
                };
            }
            const { id } = data.data;
            const response = await this.userDBRepo.checkIfExist({ _id: id });
            if ( response.status === false ) {
                return {status: false, error: response.error};
            }
            if (response) {
                let _data = response.data
                return {
                    status: true,
                    message: 'Information Fetched SuccessFully',
                    data: _data
                }
            } else {
                return {status: false, error: 'unable to get user information'};
            }
        } catch (error) {
            return {status: false, error: 'unable to get user information'};
        }
    }

    updateApiSettings = async ({userId, webHooks, secretKey}) => {
        try {
            const data = this.userEntity.validateApiSettingEntries({userId, webHooks, secretKey});
            console.log(data);
            if (!data.status || !data.data) {
                return {
                    status: false,
                    error: data.error
                };
            }
            const response = await this.userDBRepo.checkIfExist({ _id: userId });
            if ( response.status === false ) {
                return {status: false, error: response.error};
            }
            const user = await this.userDBRepo.updateUserDetailToDB(userId, {webHooks, secretKey});
            if (user) {
                return {
                    status: true,
                    message: 'Information Fetched SuccessFully',
                    data: user.data
                }
            } else {
                return {status: false, error: 'unable to get user information'};
            }
        } catch (error) {
            return {status: false, error: 'unable to get user information'};
        }
    }

    updateUserSettings = async ({userId, name, email}) => {
        try {
            const data = this.userEntity.validateUserSettingEntries({userId, name, email});
            console.log(data);
            if (!data.status || !data.data) {
                return {
                    status: false,
                    error: data.error
                };
            }
            const response = await this.userDBRepo.checkIfExist({ _id: userId });
            if ( response.status === false ) {
                return {status: false, error: response.error};
            }
            const user = await this.userDBRepo.updateUserDetailToDB(userId, {...data.data, userId: undefined});
            if (user) {
                return {
                    status: true,
                    message: 'Information Fetched SuccessFully',
                    data: user.data
                }
            } else {
                return {status: false, error: 'unable to get user information'};
            }
        } catch (error) {
            return {status: false, error: 'unable to get user information'};
        }
    }
}

module.exports = UserService;