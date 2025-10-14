const { createClient } = require('redis');
const CHANNEL = 'agentic:eventbus';

class RedisEventBus {
  constructor() {
    this.pub = createClient({ url: process.env.REDIS_URL });
    this.sub = createClient({ url: process.env.REDIS_URL });
    this.handlers = new Map();

    (async () => {
      await this.pub.connect();
      await this.sub.connect();

      console.log('Redis EventBus connected.');

      await this.sub.subscribe(CHANNEL, (message) => {
        try {
          const { event, data } = JSON.parse(message);
          const fns = this.handlers.get(event) || [];
          for (const fn of fns) {
            try {
              fn(data);
            } catch (e) {
              console.error(`Handler for ${event} failed:`, e.message);
            }
          }
        } catch (err) {
          console.error('Invalid event payload:', err.message);
        }
      });
    })().catch((err) => console.error('Redis EventBus error:', err.message));
  }

  on(event, handler) {
    if (!this.handlers.has(event)) this.handlers.set(event, []);
    this.handlers.get(event).push(handler);
  }

  async emitEvent(event, data) {
    console.log(`Emitting event: ${event}`);
    await this.pub.publish(CHANNEL, JSON.stringify({ event, data }));
  }
}

module.exports = new RedisEventBus();
