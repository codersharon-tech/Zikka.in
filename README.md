
# ZIKAA Website

A responsive creative website using HTML, CSS, JavaScript and Firebase.

## Features

- Products, projects and blog pages
- Owner dashboard with Google sign-in
- Public feedback form
- Private project requirement submissions
- Firestore database and security rules
- Aqua-blue, cream and black design

## Setup

1. Create a Firebase project.
2. Register a Firebase web app.
3. Copy its configuration into js/firebase-config.js.
4. Enable Google sign-in in Firebase Authentication.
5. Create a Firestore database.
6. Set the owner UID in js/admin.js and firestore.rules.
7. Publish the Firestore security rules.
8. Open the site through VS Code Live Server.

## Important

Never put Firebase service-account credentials or private server
secrets in client-side JavaScript.

Firestore security rules must be published in Firebase Console.
Local rules and index files do not activate themselves.

Use the intended owner Google account for the admin dashboard.
