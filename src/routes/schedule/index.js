//@ts-check

const ScheduleController = require('../../domain/controllers/schedule');
const ScheduleService = require('../../domain/services/schedule');
const MailingEntity = require('../../domain/entities/mailing');

const RequestHandler = require('../../lib/handlers/request');

const Mailer = require('../../lib/repositories/mailer');
const Schedule = require('../../lib/repositories/scheduler');
const FileUploader = require('../../lib/repositories/files');
const Authorization = require('../../lib/repositories/auth-enc');

const config = require('../../lib/constant/config');

const router = (route, logger) => {
    const authKey = config.auth.userAuthKey;

    const mailerRepo = new Mailer();
    const scheduleRepo = new Schedule();
    const fileRepo = new FileUploader(config.file);
    const authenticationRepo = new Authorization({key: authKey});

    const requestHandler = new RequestHandler({fileRepo, authenticationRepo, route});
    const mailingEntity = new MailingEntity();
    const scheduleService = new ScheduleService({ mailerRepo, scheduleRepo, mailingEntity, logger });

    const scheduleController = new ScheduleController({ scheduleService, requestHandler });

    scheduleController.init();
}

module.exports = router;