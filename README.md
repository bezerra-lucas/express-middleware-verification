# Express Middleware Verification

This library provides a simple middleware for Express.js applications to filter and ignore specific fields and values from the response data.

## Installation

```sh
npm install express-middleware-verification
```


## Usage

```js

const expressMiddlewareVerification = require('express-middleware-verification');

const options = {
  ignoreValues: [null, "undefined"],
  ignoreFields: ["password"],
  ignoreIfPresent: ["deleted_at"],
};

app.use(expressMiddlewareVerification(options));
```

### Options 

- `ignoreValues` (default: `[null, "undefined"]`) - An array of values to ignore when filtering response data. 
- `ignoreFields` (default: `["password"]`) - An array of field names to ignore when filtering response data. 
- `ignoreIfPresent` (default: `["deleted_at"]`) - If any field in this array is present in an object, the whole object will be ignored.
## How it works 

1. The middleware checks if the response data should be ignored based on the presence of any fields specified in `ignoreIfPresent`.
2. If the response data should not be ignored, the middleware filters the ignored fields and values.
3. The filtered response data is then sent as the response.