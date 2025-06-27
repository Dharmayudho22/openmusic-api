const redis = require('redis');
const config = require('../utils/config');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      url: config.redis.host, 
    });
  
    this._client.on('error', (error) => {
      console.error('Redis Client Error:', error);
    });
  
    this._client.connect();
  }

  async set(key, value, expirationInSecond = 1800) { 
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }
  
  // Get data from cache
  async get(key) {
    const result = await this._client.get(key);
    if (result) {
      // If data is JSON, parse it before returning
      try {
        return JSON.parse(result);
      } catch (error) {
        return result; // If not JSON, return as is
      }
    }
    return null;
  }
  
  // Delete data from cache
  async delete(key) {
    return this._client.del(key);
  }
}
  
module.exports = CacheService;