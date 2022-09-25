//@ts-check
//User Schema

class UserModel{
    constructor() {
        const { Schema, model, Types } = require('mongoose');

        let schema = new Schema({
          firstName: {
            type: String,
            required: true,
          },
          surName: {
            type: String,
          },
          otherName: {
            type: String,
          },
          email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
          },
          password: {
            type: String,
            required: true,
          },
          secretKey: {
            type: String,
            unique: true,
          },
          publicKey: {
            type: String,
          },
          webHooks: [{
            name: {
              type: String
            },
            value: {
              type: String
            }
          }],
          verified: {
            type: Boolean,
            default: false,
          },
          isActive: {
            type: Boolean,
            default: true,
          },
          location: {
            city: { 
              type: String
            },
            country: { 
              type: String
            },
            postalCode: { 
              type: String
            },
          },
          usedTimes: {
            type: Number,
            default: 0,
          },
          plan: {
            type: String,
            enum: ['free', 'basic', 'pro', 'enterprise'],
            default: 'free'
          },
          lastUsed: {
            type: Date,
            default: new Date(),
          },
          timeUsedPerDay: [{
            date: {type: Date, default: new Date(),},
            timeUsed: {type: Number, default: 0},
            toEmail: {type: String},
          }],
          isDeleted: {
            type: Boolean,
            default: false,
          },
          verificationCode: {
            type: String,
          },
          role: {
            type: String,
          },
          createDate: {
            type: Date,
            default: Date.now(),
          },
          updateDate: {
            type: Date,
            default: Date.now(),
          },
          status: {
            type: String,
          },
          comments: [{
            type: Types.ObjectId,
            ref: "Comment",
          }],
          cardInfo: [{
            name: {
                type: String,
            },
            number: {
                type: String,
            },
            cvv: {
                type: String,
            },
            exp: {
                type: String
            },
          }],
        })
        this.User =  model("User", schema);
    }

    saveUserToDB = async (details) => {
        try {
            const data = await this.User.create(details);
            console.log('why now',data);
            if (data) {
              return {status: true, data};
            } else {
              return {status: false, error: "Couldn't create user"};
            }
        } catch (error) {
          console.log(error);
            return {status: false, error };
        }
    }

    updateUserDetailToDB = async (id, details) => {
        try {
            const data = await this.User.findByIdAndUpdate(id, details, {new: true});
            if (data) {
              return {status: true, data};
            } else {
              return {status: false, error: "Couldn't update user"};
            }
        } catch (error) {
            return {status: false, error };
        }
    }

    checkIfExist = async (details) => {
        try {
            const data = await this.User.findOne(details);
            if (data) {
                return {status: true, data};
            }else {
                return {status: false, error: `Can't find Details`};
            }
        } catch (error) {
            return {status: false, error }
        }
    }
}

module.exports = UserModel;
