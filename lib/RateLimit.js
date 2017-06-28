class ApiKeyRequestMemoryStore {
  constructor() {
    this.db = {};
  }

  getRecentRequests(apiKey, requestLimit) {
    const recentRequests = this.db[apiKey] || [];

    return recentRequests.slice(-requestLimit);
  }

  addApiKeyRequest(apiKey, accessTime) {
    const requests = this.db[apiKey] || [];
    requests.push(accessTime);

    this.db[apiKey] = requests;
  }
}

function RateLimit(option) {
  const requestStore = new ApiKeyRequestMemoryStore();
  const maxRequests = option.maxRequests;
  const timePeriod = option.timeWindowInMs;

  function rateLimit(request, response, next) {
    const apiKey = request.headers.authorization;
    const now = new Date().getTime();

    const requestsInTimeWindow = requestStore.getRecentRequests(apiKey, maxRequests)
      .filter(requestTime => requestTime >= now - timePeriod);

    const startOfTimeWindow = requestsInTimeWindow.length > 0 ? requestsInTimeWindow[0] : now;

    response.set({
      'X-RateLimit-Limit': maxRequests,
      'X-RateLimit-Remaining': maxRequests - requestsInTimeWindow.length - 1,
      'X-RateLimit-Reset': startOfTimeWindow + timePeriod,
    });

    if (requestsInTimeWindow.length >= maxRequests) {
      return response
        .status(429)
        .set({ 'X-RateLimit-Remaining': 0 })
        .json({ message: 'Too many requests' });
    }

    requestStore.addApiKeyRequest(apiKey, now);

    return next();
  }

  return rateLimit;
}

module.exports = RateLimit;
