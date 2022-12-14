class _BaseController {
    constructor ({host}) {
        this._host = host;
    }

    host = (path) => {
        return `${this._host}${path}`
    }

    init = () => {
        Object.entries(this).map((value, _index) => {
            if ( typeof(value[1]) === 'function' && value[0] !== 'init' && value[0] !== 'host' ) {
                value[1]();
            }
        })
    }
}

module.exports = _BaseController;