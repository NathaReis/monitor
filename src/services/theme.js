const $html = document.querySelector("html");
const $header = document.querySelector("header");

function getTheme () {
    const theme = localStorage.getItem("theme");
    setTheme(theme ? theme : 'Claro');
}
getTheme();

function setTheme (localTheme) {
    // Tag usada para mostrar o tema
    const theme = document.querySelector("#theme");
    
    // Definindo o valor visto na página
    theme.innerHTML = localTheme === "Claro" ? "Escuro" : "Claro";

    // Alterando tema
    theme.onclick = () => {
        localStorage.setItem("theme", localTheme === "Claro" ? "Escuro" : "Claro");
        getTheme();
    }

    // Definindo tema no html
    localTheme === "Claro" ? $html.classList.add("light") : $html.classList.remove("light");
};