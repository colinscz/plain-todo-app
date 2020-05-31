'use strict';

export default class Router {

    constructor(routes = [], renderNode) {
        this.routes = routes;
        this.renderNode = renderNode;
        this.navigate(location.pathname + location.hash);
    }

    /**
     * Add additional routes to router (utility function)
     * @param routes
     */
    addRoutes(routes) {
        this.routes = [...this.routes, ...routes];
    }

    /**
     *
     * @param route
     * @param requestPath
     * @returns matchedRoute or undefined
     */
    match(route, requestPath) {
        let paramNames = [];
        let regexPath =
            route.path.replace(/([:*])(\w+)/g, (full, colon, name) => {
                paramNames.push(name);
                return "([^/]+)";
            }) + "(?:/|$)";

        let params = {};
        let routeMatch = requestPath.match(new RegExp(regexPath));
        if (routeMatch !== null) {
            params = routeMatch.slice(1).reduce((params, value, index) => {
                if (params === null) params = {};
                params[paramNames[index]] = value;
                return params;
            }, null);
        }

        route.setProps(params);

        return routeMatch;
    }

    async navigate (path) {
        if ('/' === path) {
            $('main').load('all-notes.html');
        } else {
            const route = this.routes.filter((route) => this.match(route, path))[0];
            console.log('route matched is: ', route);

            if (!route) {
                $('main').load('error.html');
                // TODO forward to route 404 html with crying face
                this.renderNode.innerHTML = "404! Page not found";
            } else {
                history.pushState({}, "", path);


                await route.view.doBootstrap();

            }
        }
    }

}

