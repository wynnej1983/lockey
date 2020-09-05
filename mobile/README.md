# Lockey Smart Lock App

### Installation instructions

1. Go to the project folder:

`cd lockey`

2. Install packages:

`npm install --prefix ./mobile`

3. Install pods:

`cd ./mobile/ios && pod install && cd -`

4. Test:

`npm test --prefix ./mobile`

5. Modify .env

`change API_URL to your local IP to enable run app on device:`

6. Run app on ios:

`npm run ios --prefix ./mobile`

7. Run app on android:

`npm run android --prefix ./mobile`
