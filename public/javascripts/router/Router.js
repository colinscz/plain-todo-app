'use strict';

export default class Router {

    constructor(routes = []) {
        this.routes = routes;
    }

    /**
     * Add additional routes to router (utility function)
     * @param routes
     */
    addRoutes(routes) {
        this.routes = [...this.routes, ...routes];
    }

    navigate(path) {
        window.location.hash = '#' + path;
    }

}

