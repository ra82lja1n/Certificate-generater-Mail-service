// --- INITIALIZATION ---
let currentTemplateId = ""; // To track which template is selected for redirect

// --- EXPLORE BUTTON ---
const exploreBtn = document.getElementById("exploreBtn");
if (exploreBtn) {
  exploreBtn.addEventListener("click", () => {
    document.getElementById("templates").scrollIntoView({
      behavior: "smooth",
    });
  });
}

// --- POPUP LOGIC ---
/**
 * Opens the certificate in full view
 * @param {string} templateId - The ID passed from the HTML (e.g., 't1', 't2')
 */
function openPopup(templateId) {
  const popup = document.getElementById("popup");
  const content = document.getElementById("popupContent");

  // Save the current template ID for the Select button
  currentTemplateId = templateId;

  // 1. Find the specific card clicked using the templateId
  const selectedCard = document.querySelector(
    `[onclick="openPopup('${templateId}')"]`,
  );
  if (!selectedCard) return;

  // 2. Clone the certificate HTML inside that card
  const originalCert = selectedCard.querySelector(".certificate");
  const certClone = originalCert.cloneNode(true);

  // 3. Reset the preview styles for full-screen view
  certClone.classList.remove("small");
  certClone.style.transform = "none";
  certClone.style.position = "relative";
  certClone.style.top = "0";
  certClone.style.left = "0";

  // 4. Clear the popup and inject the large clone
  content.innerHTML = "";
  content.appendChild(certClone);

  // 5. Show the popup and trigger CSS animations
  popup.style.display = "flex";

  // Small timeout to allow 'display: flex' to register before starting the transition
  setTimeout(() => {
    popup.classList.add("active");
  }, 10);
}

/**
 * Closes the popup when clicking the background overlay
 */
function closePopup() {
  const popup = document.getElementById("popup");
  popup.classList.remove("active");

  // Wait for the CSS transition (0.4s) before hiding the display
  setTimeout(() => {
    popup.style.display = "none";
  }, 400);
}

// --- SELECT & REDIRECT LOGIC ---
/**
 * Handles the "Select Template" button click
 * @param {Event} event - The click event
 */
function selectTemplate(event) {
  event.stopPropagation(); // Stops the popup from closing

  if (!currentTemplateId) {
    alert("No template selected!");
    return;
  }

  // REDIRECT: This sends the user to /editor/t1, /editor/t2, etc.
  window.location.href = `/editor/${currentTemplateId}`;
}

// --- EVENT LISTENERS FOR MODALS (If applicable) ---
const closeBtn = document.getElementById("close");
const modal = document.getElementById("modal");

if (closeBtn && modal) {
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
