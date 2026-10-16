// Select the shared page elements.
const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#main-navigation");
const yearElement = document.querySelector("#current-year");

// Destination objects stored in an array.
const destinations = [
    {
        name: "Bazaruto Archipelago",
        province: "Inhambane",
        experience: "Beaches, snorkeling, and marine scenery"
    },
    {
        name: "Maputo",
        province: "Maputo City",
        experience: "City life, food, and architecture"
    },
    {
        name: "Gorongosa National Park",
        province: "Sofala",
        experience: "Wildlife and nature"
    },
    {
        name: "Tofo Beach",
        province: "Inhambane",
        experience: "Beach activities and ocean scenery"
    }
];

// Select the favorite feature elements.
const favoriteButtons = document.querySelectorAll(".favorite-button");
const favoriteMessage = document.querySelector("#favorite-message");
const favoriteList = document.querySelector("#favorite-list");
const clearFavoritesButton = document.querySelector("#clear-favorites");

// Use a consistent key for browser storage.
const storageKey = "exploreMozambiqueFavorites";

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

    const isExpanded =
        menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute("aria-expanded", String(!isExpanded));

    menuButton.setAttribute(
        "aria-label",
        isExpanded ? "Open navigation menu" : "Close navigation menu"
    );

    navigation.classList.toggle("open");

    menuButton.textContent = isExpanded ? "☰" : "✕";
}

// Read saved favorites safely from localStorage.
function getSavedFavorites() {
    try {
        const storedFavorites = localStorage.getItem(storageKey);

        if (!storedFavorites) {
            return [];
        }

        const parsedFavorites = JSON.parse(storedFavorites);

        if (!Array.isArray(parsedFavorites)) {
            return [];
        }

        // Keep only valid destination names and remove duplicates.
        return [
            ...new Set(
                parsedFavorites.filter(
                    savedName =>
                        typeof savedName === "string" &&
                        destinations.some(
                            destination =>
                                destination.name === savedName
                        )
                )
            )
        ];
    } catch (error) {
        console.error("Unable to read saved favorites:", error);
        return [];
    }
}

// Save the favorites array to localStorage.
function storeFavorites(favorites) {
    try {
        localStorage.setItem(
            storageKey,
            JSON.stringify(favorites)
        );

        return true;
    } catch (error) {
        console.error("Unable to save favorites:", error);
        return false;
    }
}

// Display the favorite destinations on the page.
function displayFavorites() {
    if (!favoriteList) {
        return;
    }

    const favorites = getSavedFavorites();

    // Remove the previous list contents.
    favoriteList.replaceChildren();

    // Handle an empty favorites list.
    if (favorites.length === 0) {
        if (favoriteMessage) {
            favoriteMessage.textContent =
                "You have not saved any destinations yet.";
        }

        return;
    }

    // Create a list item for each saved destination.
    favorites.forEach(favoriteName => {
        const destination = destinations.find(
            place => place.name === favoriteName
        );

        if (!destination) {
            return;
        }

        const listItem = document.createElement("li");
        const destinationText = document.createElement("span");

        destinationText.textContent =
            `${destination.name} — ${destination.province}`;

        const removeButton = document.createElement("button");

        removeButton.type = "button";
        removeButton.textContent = "Remove";

        removeButton.setAttribute(
            "aria-label",
            `Remove ${destination.name} from favorites`
        );

        removeButton.addEventListener("click", () => {
            removeFavorite(destination.name);
        });

        listItem.append(destinationText, removeButton);
        favoriteList.appendChild(listItem);
    });

    if (favoriteMessage) {
        favoriteMessage.textContent =
            `You have ${favorites.length} saved destination` +
            `${favorites.length === 1 ? "" : "s"}.`;
    }
}

// Add a destination to favorites.
function addFavorite(destinationName) {
    const destinationExists = destinations.some(
        destination => destination.name === destinationName
    );

    if (!destinationExists) {
        if (favoriteMessage) {
            favoriteMessage.textContent = "Destination not found.";
        }

        return;
    }

    const favorites = getSavedFavorites();

    if (favorites.includes(destinationName)) {
        if (favoriteMessage) {
            favoriteMessage.textContent =
                `${destinationName} is already in your favorites.`;
        }

        return;
    }

    favorites.push(destinationName);

    if (storeFavorites(favorites)) {
        displayFavorites();

        if (favoriteMessage) {
            favoriteMessage.textContent =
                `${destinationName} has been added to your favorites.`;
        }
    } else if (favoriteMessage) {
        favoriteMessage.textContent =
            "Your favorite could not be saved. Please check your browser settings.";
    }
}

// Remove a destination from favorites.
function removeFavorite(destinationName) {
    const favorites = getSavedFavorites();

    if (!favorites.includes(destinationName)) {
        return;
    }

    const updatedFavorites = favorites.filter(
        name => name !== destinationName
    );

    if (storeFavorites(updatedFavorites)) {
        displayFavorites();

        if (favoriteMessage) {
            favoriteMessage.textContent =
                `${destinationName} has been removed from your favorites.`;
        }
    } else if (favoriteMessage) {
        favoriteMessage.textContent =
            "Your favorite could not be removed. Please try again.";
    }
}

// Remove all saved destinations after confirmation.
function clearFavorites() {
    const favorites = getSavedFavorites();

    if (favorites.length === 0) {
        if (favoriteMessage) {
            favoriteMessage.textContent =
                "There are no favorites to clear.";
        }

        return;
    }

    const confirmed = window.confirm(
        "Are you sure you want to remove all your favorite destinations?"
    );

    if (!confirmed) {
        return;
    }

    if (storeFavorites([])) {
        displayFavorites();

        if (favoriteMessage) {
            favoriteMessage.textContent =
                "All favorite destinations have been removed.";
        }
    } else if (favoriteMessage) {
        favoriteMessage.textContent =
            "Your favorites could not be cleared. Please try again.";
    }
}

// Register the mobile navigation event listener.
if (menuButton && navigation) {
    menuButton.addEventListener("click", toggleNavigation);
}

// Register an event listener for each favorite button.
favoriteButtons.forEach(button => {
    button.addEventListener("click", () => {
        const destinationName = button.dataset.destination;

        addFavorite(destinationName);
    });
});

// Register the clear-favorites event listener.
if (clearFavoritesButton) {
    clearFavoritesButton.addEventListener("click", clearFavorites);
}

// Cultural quiz questions stored as an array of objects.
const cultureQuestions = [
    {
        question: "Which music style is well known in Mozambique?",
        answers: ["Marrabenta", "Flamenco", "Reggae"],
        correctAnswer: "Marrabenta",
        explanation:
            "Marrabenta is a popular music style associated with Mozambique."
    }
];

// Select the Cultural Quiz elements.
const cultureQuizForm = document.querySelector("#culture-quiz-form");
const cultureQuizResult = document.querySelector("#culture-quiz-result");

// Check the user's answer and display feedback.
function checkCultureAnswer(event) {
    event.preventDefault();

    if (!cultureQuizResult) {
        return;
    }

    const selectedAnswer = cultureQuizForm.querySelector(
        'input[name="culture-answer"]:checked'
    );

    if (!selectedAnswer) {
        cultureQuizResult.textContent =
            "Please select an answer first.";

        return;
    }

    const question = cultureQuestions[0];

    if (
        selectedAnswer.value.trim().toLowerCase() ===
        question.correctAnswer.toLowerCase()
    ) {
        cultureQuizResult.textContent =
            `Correct! ${question.explanation}`;
    } else {
        cultureQuizResult.textContent =
            `Not quite. The correct answer is ${question.correctAnswer}. ` +
            question.explanation;
    }
}

// Activate the quiz only on a page containing its form and result element.
if (cultureQuizForm && cultureQuizResult) {
    cultureQuizForm.addEventListener("submit", checkCultureAnswer);
}

// Update the footer year.
updateFooterYear();

// Display saved favorites when the relevant element exists.
displayFavorites();


// Select the Contact Us form and feedback element.
const contactForm = document.querySelector("#contact-form");
const contactFeedback = document.querySelector("#contact-feedback");

// Handle contact form submission.
if (contactForm && contactFeedback) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Check that all required fields are valid.
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        // Display feedback to the visitor.
        contactFeedback.textContent =
            "Thank you for contacting Explore Mozambique! " +
            "Your message has not been sent because this website " +
            "does not yet have a message delivery service.";

        // Clear the form after submission.
        contactForm.reset();
    });
}