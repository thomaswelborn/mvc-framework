"use strict";var MVC=MVC||{};MVC.Events=class{constructor(){}get _events(){return this.events=this.events||{},this.events}getEventCallbacks(e){return this._events[e]||{}}getEventCallbackName(e){return e.name.length?e.name:"anonymousFunction"}getEventCallbackGroup(e,t){return e[t]||[]}on(e,t){var s=this.getEventCallbacks(e),n=this.getEventCallbackName(t),a=this.getEventCallbackGroup(s,n);return a.push(t),s[n]=a,this._events[e]=s,this}off(){switch(arguments.length){case 0:delete this.events;break;case 1:var e=arguments[0];delete this._events[e];break;case 2:e=arguments[0];var t=arguments[1],s="string"==typeof t?t:this.getEventCallbackName(t);this._events[e]&&(delete this._events[e][s],0===Object.keys(this._events[e]).length&&delete this._events[e])}return this}emit(e,t){var s=Object.values(arguments),n=Object.entries(this.getEventCallbacks(e));for(var[a,r]of n)for(var v of r){v(t,...s.splice(2)||[])}return this}};