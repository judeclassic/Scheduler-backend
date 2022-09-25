//@ts-check
//User Schema

class TemplateModel{
    constructor() {
        const { Schema, model } = require('mongoose');
      this.Template =  model("Template", new Schema({
          name: {
            type: String,
            required: true,
          },
          id: {
            type: String,
            required: true
          },
          link: {
            type: String,
            required: true
          },
          userId: {
            type: String,
            required: true
          },
          parameters: [{
            type: String
          }]
        }));
    }

    saveTemplateToDB = async (details) => {
        try {
            const data = await this.Template.create(details);
            if (!data) {
                return {status: false, error: "Template creation failed"};
            }
            return {status: true, data};
        } catch (error) {
            return {status: false, error };
        }
    }

    updateTemplateDetailToDB = async (searchable, details) => {
        try {
            const data = await this.Template.findOneAndUpdate(searchable, details);
            if (!data) {
                return {status: false, error: "Template update failed"};
            }
            return {status: true, data};
        } catch (error) {
            return {status: false, error };
        }
    }

    updateTemplateDetailWithIDToDB = async (id, details) => {
        try {
            const data = await this.Template.findByIdAndUpdate(id, details);
            if (!data) {
                return {status: false, error: "Template update failed"};
            }
            return {status: true, data};
        } catch (error) {
            return {status: false, error };
        }
    }

    deleteTemplateDetailFromDB = async (id) => {
        try {
            const data = await this.Template.findByIdAndDelete(id);
            if (!data) {
                return {status: false, error: "Template deletion failed"};
            }
            return {status: true, data};
        } catch (error) {
            return {status: false, error };
        }
    }

    checkIfExist = async (details) => {
        try {
            const data = await this.Template.findOne(details);
            if (!data) {
                return {status: false, error: "Can't find email"};
            }
            return {status: true, data};
        } catch (error) {
            return {status: false, error }
        }
    }

    /**
     * 
     * @param  {...any} entries 
     * @returns 
     */

    checkIfAnyOfEntriesExist = async (...entries) => {
        try {
            const data = await this.Template.findOne({$or: entries});
            if (!data) {
                return {status: false, error: `Can't find ${JSON.stringify(entries)}`};
            }
            return {status: true, data};
        } catch (error) {
            console.log(error);
            return {status: false, error }
        }
    }

    /**
     * 
     * @param {String} id 
     * @returns 
     */
    checkIfIdExist = async (id) => {
        try {
            const data = await this.Template.findById(id);
            if (!data) {
                return {status: false, error: `Can't find ${id}`};
            }
            return {status: true, data};
        } catch (error) {
            return {status: false, error }
        }
    }

    getAllTemplates = async (details) => {
        try {
            const data = await this.Template.find(details);
            if (!data) {
                return {status: false, error: "Can't find email"};
            }
            return {status: true, data};
        } catch (error) {
            return {status: false, error }
        }
    }
}

module.exports = TemplateModel;
