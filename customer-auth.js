
import { auth, googleProvider } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const form = document.getElementById("customerLoginForm");
const googleButton = document.getElementById("customerGoogleBtn");
const message = document.getElementById("customerLoginMessage");
const forgotLink = document.getElementById("forgotPasswordLink");

function showMessage(text) {
  if (message) message.textContent = text;
}

function explainError(error) {
  const messages = {
    "auth/invalid-credential": "Incorrect email or password, or this account has not been registered.",
    "auth/user-not-found": "No account found. Please create an account first.",
    "auth/wrong-password": "Incorrect password. Try again or reset your password.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/operation-not-allowed": "Enable this login method in Firebase Authentication.",
    "auth/unauthorized-domain": "Add your website domain in Firebase Authorized domains.",
    "auth/popup-blocked": "Allow pop-ups for this website and try again.",
    "auth/popup-closed-by-user": "The Google sign-in window was closed.",
    "auth/network-request-failed": "Check your internet connection and try again.",
    "auth/too-many-requests": "Too many attempts. Please wait and try again."
  };

  showMessage(messages[error.code] || `Login failed: ${error.code || error.message}`);
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("customerEmail").value.trim();
  const password = document.getElementById("customerPassword").value;

  showMessage("Signing in...");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Customer login error:", error);
    explainError(error);
  }
});

googleButton?.addEventListener("click", async () => {
  showMessage("Opening Google sign-in...");

  try {
    await signInWithPopup(auth, googleProvider);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Google login error:", error);
    explainError(error);
  }
});

forgotLink?.addEventListener("click", async (event) => {
  event.preventDefault();

  const email = document.getElementById("customerEmail").value.trim();

  if (!email) {
    showMessage("Enter your email address first.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    showMessage("If an account exists for this email, a reset email will be sent.");
  } catch (error) {
    console.error("Password reset error:", error);
    explainError(error);
  }
});
