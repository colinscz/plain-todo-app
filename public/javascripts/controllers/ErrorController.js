export default class ErrorController {

    constructor (errorService, router) {
        this.template = `
            <div class="container">
                <img src="/images/crying-svg.svg" class="sun" />
                <p>Oh no! Page not found. Seems like the requested page is not existing.</p>
                 <p>{{errorMessage}}</p>
            </div>`;

        this.errorTemplate = Handlebars.compile(this.template);
        this.errorService = errorService;
        this.router = router;
        this.mainContainer = document.querySelector("main");
    }

    initEventHandlers() {
        console.log('here are the event handlers');
    }

    async renderErrorView() {
        this.initEventHandlers();
        const errorMessage = await this.errorService.getGeneralErrorMessage();
        this.mainContainer.innerHTML = this.errorTemplate({
            errorMessage: errorMessage
        })
    }

    async init() {
        await this.renderErrorView();
    }

    static async doBootstrap({errorService, router}) {
        await new ErrorController(errorService, router).init();
    }

}
