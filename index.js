export default function expressMiddlewareVerification(options = {}) {
  const {
    ignoreValues = [null, "undefined"],
    ignoreFields = ["password"],
    ignoreIfPresent = ["deleted_at"],
  } = options;

  function shouldIgnoreObject(obj) {
    return ignoreIfPresent.some((field) => obj[field]);
  }

  function filterIgnoredFields(obj) {
    const filteredObj = {};

    for (const key in obj) {
      if (!ignoreValues.includes(obj[key]) && !ignoreFields.includes(key)) {
        filteredObj[key] = obj[key];
      }
    }

    return filteredObj;
  }

  function filterResponseData(data) {
    if (Array.isArray(data)) {
      return data.map(filterIgnoredFields).filter(Boolean);
    }

    for (const key in data) {
      if (Array.isArray(data[key])) {
        data[key] = data[key].map(filterIgnoredFields).filter(Boolean);
      } else if (typeof data[key] === "object") {
        data[key] = filterIgnoredFields(data[key]);
      } else if (data[key] === null) {
        delete data[key];
      }
    }

    return data;
  }

  return function expressMiddleware(req, res, next) {
    const originalSend = res.send;

    res.send = function (responseBody) {
      const parsedData = JSON.parse(responseBody);

      if (!shouldIgnoreObject(parsedData)) {
        const filteredData = filterResponseData(parsedData);
        responseBody = JSON.stringify(filteredData);
      }

      originalSend.call(this, responseBody);
    };

    next();
  };
}
