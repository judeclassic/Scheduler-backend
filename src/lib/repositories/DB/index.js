

//@ts-check
const Config = require('../../constant/config');
const Logger = require('../logger/index')

class DBConnection{
    /**
     * 
     * @param {Logger} logger 
     */
    constructor(logger) {
        this.mongoose = require('mongoose');
        this.logger = logger
    }

    /**
     * 
     * @param {{config: Config}} param0 
     */
    connect = async ({config}) => {
        try{
            this.dbUrl = config.db.url;
            if (process.env.NODE_ENV === 'test') {
                const { MongoMemoryServer } = require('mongodb-memory-server');
                this.mongod = await MongoMemoryServer.create();
                this.dbUrl = this.mongod.getUri();
              }
            await this.mongoose.connect(this.dbUrl);
            this.mongoose.connection.once('open', (err)=>{
                if (err) console.log(`Error: ${err}`);
                this.logger.info(`${config.name} database connected successfully`);
            })
        }catch(err){
            this.logger.error(`Error: ${err}`);

            setTimeout(()=>{
                process.exit(1);
            }, 5000);
        }
    }

    close = async () => {
        try {
            await this.mongoose.connection.close();
            if (this.mongod) {
              await this.mongod.stop();
            }
          } catch (err) {
            console.log(err);
            process.exit(1);
          }
    }
}

module.exports = DBConnection;