
import { auth, googleProvider } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const form = document.getElementById("customerRegisterForm");
const googleButton = document.getElementById("registerGoogleBtn");
const message = document.getElementById("registerMessage");

function showMessage(text) {
  message.textContent = text;
}

function explainError(error) {
  const messages = {
    "auth/email-already-in-use": "This email already has an account. Please sign in.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Choose a stronger password with at least 8 characters.",
    "auth/operation-not-allowed": "Enable Email/Password in Firebase Authentication.",
    "auth/popup-closed-by-user": "The Google sign-in window was closed.",
    "auth/popup-blocked": "Allow pop-ups for this website and try again.",
    "auth/unauthorized-domain": "Add your website domain to Firebase Authorized domains.",
    "auth/network-request-failed": "Network error. Check your internet connection."
  };

  showMessage(messages[error.code] || `Registration failed: ${error.code || error.message}`);
}

// Register with email and password
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;

  if (!name) {
    showMessage("Please enter your name.");
    return;
  }

  showMessage("Creating your account...");

  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(credential.user, {
      displayName: name
    });

    window.location.href = "index.html";
  } catch (error) {
    console.error("Customer registration error:", error);
    explainError(error);
  }
});

// Register or sign in with Google
googleButton.addEventListener("click", async () => {
  showMessage("Connecting to Google...");

  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    await signInWithPopup(auth, provider);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Google registration error:", error);
    explainError(error);
  }
});
