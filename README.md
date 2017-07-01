This is a project to demonstrate a simple solution to limit request rates based on API key.

## Quick Start:
The code requires nodejs version >= v6.x

Install dependencies
```commandline
npm install
```

Start the API Server
```commandline
npm start
```

Run ESLint & Unit test, the html version of coverage report saved in coverage/lcov-report
```commandline
npm test
```

## Technical Notes:

- Logging Framework
  
  Using bunyan for logging, because it supports childLogger, json and metadata which makes the log indexing very easy, e.g. using ElasticSearch. 
   
- ESLint

  Using airbnb-base coding style because it's pretty popular.
  
- Test Coverage

  Using istanbul for code coverage and the code is 100 percentage covered

- Api key for open weather map 

  In a real project, the api key should be encrypted, 
  To make this demo server simple to run, I hardcoded it in code. 
