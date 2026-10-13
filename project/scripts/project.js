const menuButton = document.querySelector(”#menu - button”);
const navigation = document.querySelector(”#main - navigation”);
const yearElement = document.querySelector(”#current - year”);

function updateFooterYear() {
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function toggleNavigation() {
    if (!menuButton || !navigation) {
        return;
    }

    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isExpanded));
    menuButton.setAttribute(
        "aria-label",
        isExpanded ? "Open navigation menu" : "Close navigation menu"
    );
    navigation.classList.toggle("open");

}

if (menuButton) {
    menuButton.addEventListener(“click”, toggleNavigation);
}

updateFooterYear();