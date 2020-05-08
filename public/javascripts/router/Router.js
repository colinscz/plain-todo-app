'use strict';


export const routes  = {
    home: { id: 'home', path: 'homepage', view: 'homepage' },
    allNotes: { id: 'all-notes', path: 'all-notes', view: 'all-notes' },
    newNote: { id: 'new-note', path: 'new-note', view: 'new-note' }
}

export class Router {

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

    navigate(path) {
        const route = this.routes.filter((route) => this.match(route, path))[0];
        console.log('route matched is: ', route);

        if (!route) {
            // TODO forward to route 404 html with crying face
            this.renderNode.innerHTML = "404! Page not found";
        }
        else {
            history.pushState({}, "", path);

            render(route.renderView(), this.renderNode); // avoided innerHTML // find other solution for this !
        }
    }



    select_tab(id) {
        // remove selected class from all buttons
        document.querySelectorAll(".route").forEach(item => item.classList.remove('selected'));
        // select clicked element (visually)
        document.querySelectorAll("#" + id).forEach(item => item.classList.add('selected'));
    }


    loadContent(id) {
        // Update text "Content loading for {id}..."
        // Of course, here you would do you content loading magic
        // Perhaps run Fetch API to update resources
        document.querySelector("#content").innerHTML = 'Content loading for /' + id + '...';
        $('content').load(`./pages/${id}.html`);
    }

    push(event) {
        // Get id attribute of the box or button or link clicked
        let id = event.target.id;
        // Visually select the clicked button/tab/box
       // select_tab(id);
        // Update Title in Window's Tab
        document.title = id;
        // Load content for this tab/page
        this.loadContent(id);
        // Finally push state change to the address bar
        window.history.pushState({id}, `${id}`, `/page/${id}`);
    }

}

export default class Route {

}
