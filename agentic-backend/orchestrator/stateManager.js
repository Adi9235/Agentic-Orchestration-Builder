const { createClient } = require('redis');
const { Run } = require('../models');

let redis;
(async () => {
  try {
    redis = createClient({ url: process.env.REDIS_URL });
    await redis.connect();
    console.log('Redis connected for state manager');
  } catch (e) {
    console.warn('Redis unavailable, falling back to DB only');
  }
})();

module.exports = {
  async saveState(runId, state) {
    if (redis) {
      try {
        await redis.set(`run:${runId}:state`, JSON.stringify(state));
      } catch (e) {
        console.warn('Redis state save failed', e.message);
      }
    }
    await Run.update({ state }, { where: { run_id: runId } });
  },

  async getState(runId) {
    if (redis) {
      try {
        const cached = await redis.get(`run:${runId}:state`);
        if (cached) return JSON.parse(cached);
      } catch (e) {
        console.warn('Redis state fetch failed', e.message);
      }
    }
    const run = await Run.findOne({ where: { run_id: runId } });
    return run ? run.state : null;
  }
};
