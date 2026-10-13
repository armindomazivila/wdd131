const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#main-navigation");
const yearElement = document.querySelector("#current-year");

// Update the footer with the current year.
function updateFooterYear() {
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Open or close the mobile navigation menu.
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
    menuButton.textContent = isExpanded ? "☰" : "✕";
}

// Listen for clicks on the navigation button.
if (menuButton) {
    menuButton.addEventListener("click", toggleNavigation);
}

// Run the function to update the footer.
updateFooterYear();