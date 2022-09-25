//@ts-check
const Cron = require('simple-node-cron').Cron;

class Scheduler {
    constructor() {
        this.actions = {};
    }
    _schedule = ({id, action, final, cron}) => {
        this.actions[id] = new Cron(cron, function() {
            action();
            final();
        });
        this.actions[id].once();
    }

    cancel = ({id}) => {
        if (this.actions[id]) {
            this.actions[id].stop();
            delete this.actions[id];
        }
    }

    scheduleForTwoWeeks = (action, id) => {
        let cron = '* * * * *';
        let final = ()=> {}
        this._schedule({action, final, id, cron});
    }

    scheduleForThreeDays = (action, id) => {
        const days = this._calculateWithDayCron(3);
        var final = ()=> {}
        var cron = `* * * ${days} *`;
        this._schedule({action, final, id, cron});
    }

    scheduleForFiveDays = (action, id) => {
        const days = this._calculateWithDayCron(5);
        var final = ()=> {}
        var cron = '* * * * *';
        this._schedule({action, final, id, cron});
    }

    scheduleForSeconds = (action, id) => {
        const sec = this._calculateWithSecondsCron(7);
        var final =  ()=> {}
        var cron = `* * * * *`;
        this._schedule({action, final, id, cron});
    }

    _calculateWithDayCron = (dday) => {
        const date = new Date();
        const day = date.getDay();
        var newDay = day + dday;
        if (newDay > 7) {
            newDay = newDay - (7);
        }
    
        return newDay;
    }

    _calculateWithSecondsCron = (ssec) => {
        const date = new Date();
        const sec = date.getSeconds();
        var newSec = sec + ssec;
        if (newSec > 7) {
            newSec = newSec - (7);
        }
    
        return newSec;
    }

}

module.exports = Scheduler;