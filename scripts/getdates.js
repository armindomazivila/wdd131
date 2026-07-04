const today = new Date();

document.getElementById("currentYear").textContent = today.getFullYear();

document.getElementById("lastModified").textContent =
    `Last Modification: ${document.lastModified}`;