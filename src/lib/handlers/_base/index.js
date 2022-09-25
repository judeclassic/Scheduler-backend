
class _BaseHandler {
    constructor ({ route }) {
        this.route = route;
    }

    _addHost = (host) => {
        this.host = host;
    }

    _post = (path, ...args) => {
        const host = `${this.host}${path}`;
        return this.route.post(host, ...args);
    }

    _get = (path, ...args) => {
        const host = `${this.host}${path}`;
        return this.route.get(host, ...args);
    }

    _put = (path, ...args) => {
        const host = `${this.host}${path}`;
        return this.route.put(host, ...args);
    }

    _delete = (path, ...args) => {
        const host = `${this.host}${path}`;
        return this.route.delete(host, ...args);
    }
}

module.exports = _BaseHandler;