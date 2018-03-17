# Habitbook

![Travis](https://img.shields.io/badge/build-passing-brightgreen.svg)

Progressive Web App that helps you create and maintain good habits, or eliminate old ones through gamification and social aspect.

### Build
* `yarn build`

### Develop
* `yarn start`

### Deploy
* `index.html` and `manifest.json` needs to be manually put to `/build` (duplicated) for deploy
* check `firebaseConfig` in `configureStore.js`, optionally check:`firebase.json`, `firebaserc`, `database.rules.json`
* `firebase login`
* `yarn deploy`
