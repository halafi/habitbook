# Habitbook

![Travis](https://img.shields.io/badge/build-passing-brightgreen.svg)

Progressive Web App that helps you create and maintain good habits, or eliminate old ones.

### Build
* `yarn build`

### Develop
* `yarn start`

### Deploy
Until parcel fixes PWA support:
* `index.html` and `manifest.json` needs to be manually put to `/build` (duplicated) for deploy

Deploy to Firebase:
* edit `firebaseConfig` in `configureStore.js`, optionally: `firebase.json`, `firebaserc`, `database.rules.json`
* `firebase login`
* `yarn deploy`
