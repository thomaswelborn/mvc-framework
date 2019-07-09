MVC.Channels = class {
  constructor() {}
  get channels() {
    this._channels = (this._channels)
      ? this._channels
      : {}
    return this._channels
  }
  channel(channelName) {
    this.channels[channelName] = (this.channels[channelName])
      ? this.channels[channelName]
      : new MVC.Channels.Channel()
    return this.channels[channelName]
  }
  off(channelName) {
    delete this.channels[channelName]
  }
}
