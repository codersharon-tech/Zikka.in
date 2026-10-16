
import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Load published items from Firestore
async function loadPublishedItems(collectionName, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.textContent = "Loading...";

  try {
    const itemsQuery = query(
      collection(db, collectionName),
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(itemsQuery);

    container.replaceChildren();

    if (snapshot.empty) {
      container.textContent = "No items published yet.";
      return;
    }

    snapshot.forEach((documentSnapshot) => {
      const item = documentSnapshot.data();
      const card = document.createElement("article");
      card.className = "content-card";

      const title = document.createElement("h3");
      title.textContent = item.title || "Untitled";

      const description = document.createElement("p");
      description.textContent = item.description || "";

      card.append(title, description);
      container.appendChild(card);
    });
  } catch (error) {
    console.error(`Could not load ${collectionName}:`, error);
    container.textContent =
      "Could not load content. Please check your Firebase setup.";
  }
}

// Submit public feedback
const feedbackForm = document.getElementById("feedbackForm");

if (feedbackForm) {
  feedbackForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("feedbackName")?.value.trim();
    const message = document.getElementById("feedbackMessage")?.value.trim();
    const status = document.getElementById("feedbackStatus");

    if (!name || !message) {
      if (status) status.textContent = "Please complete all fields.";
      return;
    }

    try {
      await addDoc(collection(db, "feedback"), {
        name,
        message,
        createdAt: serverTimestamp()
      });

      feedbackForm.reset();
      if (status) status.textContent = "Thank you for your feedback!";
    } catch (error) {
      console.error("Feedback submission failed:", error);
      if (status) status.textContent = "Could not submit feedback.";
    }
  });
}

// Submit a private project requirement
const projectForm = document.getElementById("projectRequestForm");

if (projectForm) {
  projectForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("requestName")?.value.trim();
    const email = document.getElementById("requestEmail")?.value.trim();
    const details = document.getElementById("requestDetails")?.value.trim();
    const status = document.getElementById("requestStatus");

    if (!name || !email || !details) {
      if (status) status.textContent = "Please complete all fields.";
      return;
    }

    try {
      await addDoc(collection(db, "projectRequests"), {
        name,
        email,
        details,
        createdAt: serverTimestamp()
      });

      projectForm.reset();
      if (status) status.textContent = "Your project request was sent!";
    } catch (error) {
      console.error("Project request failed:", error);
      if (status) status.textContent = "Could not send your request.";
    }
  });
}

// Load content only when its display area exists
loadPublishedItems("products", "productsContainer");
loadPublishedItems("projects", "projectsContainer");
loadPublishedItems("blogs", "blogsContainer");
