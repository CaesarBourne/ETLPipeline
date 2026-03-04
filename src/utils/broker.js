const EventEmitter = require('events')

class Broker {
  constructor() {
    this.topics = {}
  }

  publish(topic, data) {
    if (!this.topics[topic])
      this.topics[topic] = new EventEmitter()

    this.topics[topic].emit('message', data)
  }

  subscribe(topic, handler) {
    if (!this.topics[topic])
      this.topics[topic] = new EventEmitter()

    this.topics[topic].on('message', handler)
  }
}

module.exports = new Broker()