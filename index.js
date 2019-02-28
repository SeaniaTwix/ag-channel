const ConsumableStream = require('consumable-stream');

class AGChannel extends ConsumableStream {
  constructor(name, client, eventDemux, dataDemux) {
    super();
    this.PENDING = AGChannel.PENDING;
    this.SUBSCRIBED = AGChannel.SUBSCRIBED;
    this.UNSUBSCRIBED = AGChannel.UNSUBSCRIBED;

    this.name = name;
    this.client = client;

    this._eventDemux = eventDemux;
    this._dataStream = dataDemux.stream(this.name);
  }

  createConsumer(timeout) {
    return this._dataStream.createConsumer(timeout);
  }

  listener(eventName) {
    return this._eventDemux.stream(`${this.name}/${eventName}`);
  }

  closeListener(eventName) {
    this.client.closeChannelListener(this.name, eventName);
  }

  closeAllListeners() {
    this.client.closeAllChannelListeners(this.name);
  }

  getDataBackpressure() {
    return this.client.getChannelDataBackpressure(this.name);
  }

  getBackpressure() {
    return this.client.getChannelBackpressure(this.name);
  }

  getListenerConsumerStats(consumerId) {
    return this.client.getChannelListenerConsumerStats(consumerId);
  }

  getListenerConsumerStatsList(eventName) {
    return this.client.getChannelListenerConsumerStatsList(this.name, eventName);
  }

  getAllListenersConsumerStatsList() {
    return this.client.getAllChannelListenerConsumerStatsList(this.name);
  }

  killListener(eventName) {
    this.client.killChannelListener(this.name, eventName);
  }

  killAllListeners() {
    this.client.killAllChannelListeners(this.name);
  }

  killListenerConsumer(consumerId) {
    this.client.killChannelListenerConsumer(consumerId);
  }

  getListenerBackpressure(eventName) {
    return this.client.getChannelListenerBackpressure(this.name, eventName);
  }

  getAllListenersBackpressure() {
    return this.client.getAllChannelListenersBackpressure(this.name);
  }

  getListenerConsumerBackpressure(consumerId) {
    return this.client.getChannelListenerConsumerBackpressure(consumerId);
  }

  hasListenerConsumer(eventName, consumerId) {
    return this.client.hasChannelListenerConsumer(this.name, eventName, consumerId);
  }

  hasAnyListenerConsumer(consumerId) {
    return this.client.hasAnyChannelListenerConsumer(this.name, consumerId);
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

  transmitPublish(data) {
    return this.client.transmitPublish(this.name, data);
  }

  invokePublish(data) {
    return this.client.invokePublish(this.name, data);
  }
}

AGChannel.PENDING = 'pending';
AGChannel.SUBSCRIBED = 'subscribed';
AGChannel.UNSUBSCRIBED = 'unsubscribed';

module.exports = AGChannel;
