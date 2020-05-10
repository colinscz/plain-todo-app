import Router from './Router.js';

export const link = (path) => {
    const pushStateEvent = new CustomEvent("_pushstate", { detail: path });
    history.pushState({}, "", path);
    dispatchEvent(pushStateEvent);
};

export default (routes) => {
    const router = new Router(routes, document.getElementById("app"));

    document.addEventListener("DOMContentLoaded", (e) => {
        document.querySelectorAll("[href]").forEach((route) =>
            route.addEventListener(
                "click",
                (e) => {
                    e.preventDefault();
                    console.log('test id selection: ', e.target.getAttribute("route"));
                    router.navigate(e.target.getAttribute("route"));
                },
                false
            )
        );
    });

    window.addEventListener("_pushstate", (e) => router.navigate(e.detail));
};

