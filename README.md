# Habitbook

Progressive Web App that helps you create and maintain good habits, or eliminate old ones.

### Build
* `yarn build`

### Develop
* `yarn start`

### Deploy
Until parcel fixes PWA support:
* `index.html`, `manifest.json`, `images/icons` need to be manually put to `/build` for deploy

Deploy to Firebase:
* `firebase login`
* `yarn deploy`
