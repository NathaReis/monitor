export class ControlService {
    constructor(body) {
        this.$body = body;
    }

    createControl() {
        const footer = document.createElement("footer");
        footer.onclick = () => {
            footer.classList.toggle("active");
        }
        this.$body.appendChild(footer);
    }
}