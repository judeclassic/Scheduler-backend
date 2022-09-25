//@ts-check
class Schedule {
    constructor({ mailerRepo, scheduleRepo, mailingEntity, logger }) {
        this.scheduleRepo = scheduleRepo;
        this.mailerRepo = mailerRepo;
        this.mailingEntity = mailingEntity;
        this.logger = logger;
    }

    schedule = async ({ id, email, name, subject }, time) => {
        try {
            const validatedData = await this.mailingEntity.validateModel({ id, email, name });
            if (!validatedData.status) {
                return {
                    status: false,
                    error: validatedData.error
                };
            }

            const { firstName } = validatedData.data;

            const action = async () => {
                this.mailerRepo.sendReminderEmail(validatedData.data.email, { name: firstName, subject });
            }
            switch (time) {
                case '2w':
                    this.scheduleRepo.scheduleForTwoWeeks(action, id);
                    break;
                case '2s':
                    this.scheduleRepo.scheduleForSeconds(action, id);
                    break;
            }

            return {status: true, message: 'schedule was set successfully, you can check your webhook'}
            
        } catch (err) {
            console.log(err);
        }
        this.logger.inform('set with ' + id );
    }

    cancelSchedule = ({ id }) => {
        this.scheduleRepo.cancel({id});
        this.logger.inform('cancel with ' + id );
        return {status: true, message: 'cancelled was set successfully,'}
    }
}

module.exports = Schedule;