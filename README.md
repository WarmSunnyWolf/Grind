# Grind

A calm study website for FWS310. Focus with a hand-drawn pond animal, split big tasks (rocks) into small pebbles, and study alongside friends in a shared pond.

## Files
- `index.html` is the whole site, built by `build.sh` from `src/`.
- `firebase-config.js` holds the Firebase web config (not a secret).
- `firestore.rules` are the database rules to paste into Firebase.

## Setup
1. Firebase console: create a project, add a Web app, copy its `firebaseConfig` into `firebase-config.js`.
2. Authentication > Sign-in method: enable Google. Under Settings > Authorized domains, add `<username>.github.io`.
3. Firestore Database: create a database, then paste `firestore.rules` into the Rules tab and Publish.
4. GitHub: push `index.html` and `firebase-config.js` to a public repo, then Settings > Pages > Deploy from branch `main`, folder `/`.
