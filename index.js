const AsyncIterableStream = require('async-iterable-stream');

class AGChannel extends AsyncIterableStream {
  constructor(name, client, eventDemux, dataStream) {
    super();
    this.PENDING = AGChannel.PENDING;
    this.SUBSCRIBED = AGChannel.SUBSCRIBED;
    this.UNSUBSCRIBED = AGChannel.UNSUBSCRIBED;

    this.name = name;
    this.client = client;

    this._eventDemux = eventDemux;
    this._dataStream = dataStream;
  }

  createAsyncIterator(timeout) {
    return this._dataStream.createAsyncIterator(timeout);
  }

  listener(eventName) {
    return this._eventDemux.stream(`${this.name}/${eventName}`);
  }

  closeListener(eventName) {
    this._eventDemux.close(`${this.name}/${eventName}`);
  }

  closeAllListeners() {
    this._eventDemux.closeAll();
  }

  close() {
    this.client.closeChannel(this.name);
  }

  get state() {
    return this.client.getChannelState(this.name);
  }

  set state(value) {
    throw new Error('Cannot directly set channel state');
  }

  get options() {
    return this.client.getChannelOptions(this.name);
  }

  set options(value) {
    throw new Error('Cannot directly set channel options');
  }

  subscribe(options) {
    this.client.subscribe(this.name, options);
  }

  unsubscribe() {
    this.client.unsubscribe(this.name);
  }

  isSubscribed(includePending) {
    return this.client.isSubscribed(this.name, includePending);
  }

  publish(data) {
    return this.client.publish(this.name, data);
  }
}

AGChannel.PENDING = 'pending';
AGChannel.SUBSCRIBED = 'subscribed';
AGChannel.UNSUBSCRIBED = 'unsubscribed';

module.exports = AGChannel;
