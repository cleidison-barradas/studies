# How does our enviroment variables work?

## Files on the left have more priority than files on the right:

npm start: .env.development.local, .env.local, .env.development, .env
npm run build: .env.production.local, .env.local, .env.production, .env
npm test: .env.test.local, .env.test, .env (note .env.local is missing)
These variables will act as the defaults if the machine does not explicitly set them.

# How do we treat errors ? 

  We should always look up if there's a error in the api.
  Our request engine is api sauce (axios wrapper). Info about how it treats errors below.

## How does apisauce treat errors on request

does are the fields returned by apisauce after a request is completed

data - the object originally from the server that you might wanna mess with
duration - the number of milliseconds
problem - the problem code (see the bottom for the list)
ok - true or false
status - the HTTP status code
headers - the HTTP response headers
config - the underlying axios config for the request

## problem error codes

Constant        VALUE               Status Code   Explanation
----------------------------------------------------------------------------------------
NONE             null               200-299       No problems.
CLIENT_ERROR     'CLIENT_ERROR'     400-499       Any non-specific 400 series error.
SERVER_ERROR     'SERVER_ERROR'     500-599       Any 500 series error.
TIMEOUT_ERROR    'TIMEOUT_ERROR'    ---           Server didn't respond in time.

# Getting Started with Create React App
CONNECTION_ERROR 'CONNECTION_ERROR' ---           Server not available, bad dns.
NETWORK_ERROR    'NETWORK_ERROR'    ---           Network not available.
CANCEL_ERROR     'CANCEL_ERROR'     ---           Request has been cancelled. Only possible if `cancelToken` is provided 


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


# Abouting routing 
See [https://reactrouter.com/docs/en/v6/getting-started/overview](RouterDomV6)