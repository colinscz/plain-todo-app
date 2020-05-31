import ErrorService from '../services/error-service.js';

export default class ErrorController {

    constructor (errorService) {
        this.template = `
            <div class="container">
                        <img src="/images/crying-svg.svg" class="sun" />
                        <p>Oh no! Page not found. Seems like the requested page is not existing.</p>
                         <p>{{errorMessage}}</p>
                    </div>`;

        this.errorTemplate = Handlebars.compile(this.template);
        this.errorService = errorService;
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
        console.log('init error method called')
        await this.renderErrorView();
    }

    static async doBootstrap() {
        await new ErrorController(new ErrorService()).init();
    }

}
