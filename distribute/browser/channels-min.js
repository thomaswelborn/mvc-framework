"use strict";var MVC=MVC||{};MVC.Channels=class{constructor(){}get _channels(){return this.channels=this.channels?this.channels:{},this.channels}channel(s){return this._channels[s]=this._channels[s]?this._channels[s]:new MVC.Channels.Channel,this._channels[s]}off(s){delete this._channels[s]}},MVC.Channels.Channel=class{constructor(){}get _responses(){return this.responses=this.responses?this.responses:{},this.responses}response(s,e){if(!e)return this._responses[response];this._responses[s]=e}request(s){if(this._responses[s]){var e=Array.prototype.slice.call(arguments).slice(1);return this._responses[s](...e)}}off(s){if(s)delete this._responses[s];else for(var[e]of Object.keys(this._responses))delete this._responses[e]}};