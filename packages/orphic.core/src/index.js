export default class OrphicCore {

    constructor() {
        this.initialized = false;
        this.debug = false;
    }

    init() {
        this.initialized = true;
        console.log("initialized.");
    }

    destroy() {
        this.initialized = false;
    }

}