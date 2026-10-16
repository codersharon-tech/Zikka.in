
import { auth, db, googleProvider } from "./firebase.js";
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Replace this with the UID of your own Google account.
// Find your UID in Firebase Console > Authentication > Users.
const OWNER_UID = "REPLACE_WITH_OWNER_UID";

const loginButton = document.getElementById("googleLoginBtn");
const logoutButton = document.getElementById("logoutBtn");
const loginMessage = document.getElementById("loginMessage");
const adminPanel = document.getElementById("adminPanel");

function showMessage(message) {
  if (loginMessage) loginMessage.textContent = message;
}

function showAdmin(isOwner) {
  if (adminPanel) adminPanel.hidden = !isOwner;
  if (loginButton) loginButton.hidden = isOwner;
  if (logoutButton) logoutButton.hidden = !isOwner;
}

showAdmin(false);

// Google owner login
if (loginButton) {
  loginButton.addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
      showMessage("Login failed. Check Google sign-in settings.");
    }
  });
}

// Verify the signed-in account against the owner UID
onAuthStateChanged(auth, (user) => {
  const isOwner = Boolean(user && user.uid === OWNER_UID);
  showAdmin(isOwner);

  if (user && !isOwner) {
    showMessage("This Google account is not authorized as the owner.");
  } else if (isOwner) {
    showMessage("Welcome to the ZIKAA owner dashboard!");
  }
});

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    try {
      await signOut(auth);
      showMessage("You have signed out.");
    } catch (error) {
      showMessage("Could not sign out. Please try again.");
    }
  });
}

// Create a published or unpublished product, project, or blog
const contentForm = document.getElementById("contentForm");

if (contentForm) {
  contentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user = auth.currentUser;

    if (!user || user.uid !== OWNER_UID) {
      showMessage("Only the owner can publish content.");
      return;
    }

    const type = document.getElementById("contentType")?.value;
    const title = document.getElementById("contentTitle")?.value.trim();
    const description =
      document.getElementById("contentDescription")?.value.trim();
    const publish =
      document.getElementById("contentPublished")?.checked ?? false;

    if (!["products", "projects", "blogs"].includes(type)) {
      showMessage("Choose a valid content type.");
      return;
    }

    if (!title || !description) {
      showMessage("Enter a title and description.");
      return;
    }

    try {
      await addDoc(collection(db, type), {
        title,
        description,
        published: publish,
        createdAt: serverTimestamp()
      });

      contentForm.reset();
      showMessage("Content saved successfully!");
      await loadOwnerContent();
    } catch (error) {
      console.error("Saving content failed:", error);
      showMessage("Could not save. Check Firestore security rules.");
    }
  });
}

// Display all content to the owner
async function loadOwnerContent() {
  const user = auth.currentUser;
  const list = document.getElementById("ownerContentList");

  if (!list || !user || user.uid !== OWNER_UID) return;

  list.replaceChildren();

  for (const type of ["products", "projects", "blogs"]) {
    try {
      const snapshot = await getDocs(collection(db, type));

      snapshot.forEach((itemDoc) => {
        const item = itemDoc.data();
        const row = document.createElement("div");
        row.className = "admin-content-row";

        const label = document.createElement("span");
        label.textContent = `${type}: ${item.title || "Untitled"} — ${
          item.published ? "Published" : "Draft"
        }`;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", async () => {
          if (!confirm(`Delete "${item.title || "Untitled"}"?`)) return;

          try {
            await deleteDoc(doc(db, type, itemDoc.id));
            await loadOwnerContent();
            showMessage("Content deleted.");
          } catch (error) {
            console.error(error);
            showMessage("Could not delete content.");
          }
        });

        row.append(label, deleteButton);
        list.appendChild(row);
      });
    } catch (error) {
      console.error(`Could not load ${type}:`, error);
      showMessage("Could not load content. Check your Firestore rules.");
    }
  }
}

onAuthStateChanged(auth, (user) => {
  if (user && user.uid === OWNER_UID) {
    loadOwnerContent();
  }
});
