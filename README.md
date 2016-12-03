# Cyann (Backend)

NodeJS + MongoDB backend used for providing API endpoints for **Cyann** Mobile & [Web](https://github.com/Howard-Zhou/cyann_front) Application.

## Install

Clone this repo to your local machine & install all the dependencies. (Make sure you have NodeJS, NPM & MongoDB installed on your local machine)
```
$ git clone https://github.com/Howard-Zhou/Cyann.git
$ cd ./Cyann
$ npm install
```

## Usage

To start mongoDB on your local machine (default url: localhost:27017)
``` 
$ mongod
```
Open a new tab in your terminal & start the NodeJS server (default url: localhost:8080)
```
$ npm start
```

## Development

To run your server & make it automatically reload on any file changes:
``` 
$ npm server-watch
```
To make your test suite automatically rerun on any file changes:
```
$ npm test-watch
```

## Testing

To run the entire test suite:
``` 
$ npm test
```
To generate the coverage report with [Istanbul](https://github.com/gotwarlost/istanbul), you can view the report in your browser by opening the **Cyann/coverage/lcov-report/index.html** file that's being generated:
```
$ npm run coverage
```

## API Documentation
Please refer to the API documentation located in [Cyann/doc](https://github.com/Cyann-UBC/Cyann/tree/master/docs) for details.

## Opening Issues
If you encounter a bug with Cyann (Backend) we would like to hear about it. Search the existing issues and try to make sure your problem doesn’t already exist before opening a new issue. It’s helpful if you include the version and OS you’re using. Please include a stack trace and reduced repro case when appropriate, too.
