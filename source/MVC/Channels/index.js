import Channel from './Channel/index'
const Channels = class {
  constructor() {}
  get _channels() {
    this.channels = this.channels || {}
    return this.channels
  }
  channel(channelName) {
    this._channels[channelName] = (this._channels[channelName])
      ? this._channels[channelName]
      : new Channel()
    return this._channels[channelName]
  }
  off(channelName) {
    delete this._channels[channelName]
  }
}
export default Channels
