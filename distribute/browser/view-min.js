"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _index=_interopRequireDefault(require("./Events/index")),_index2=_interopRequireDefault(require("./Channels/index")),_index3=_interopRequireDefault(require("./Utils/index")),_index4=_interopRequireDefault(require("./Service/index")),_index5=_interopRequireDefault(require("./Model/index")),_index6=_interopRequireDefault(require("./View/index")),_index7=_interopRequireDefault(require("./Controller/index")),_index8=_interopRequireDefault(require("./Router/index"));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}var MVC={Events:_index.default,Channels:_index2.default,Utils:_index3.default,Service:_index4.default,Model:_index5.default,View:_index6.default,Controller:_index7.default,Router:_index8.default},_default=MVC;exports.default=_default,Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var Events=class{constructor(){}get _events(){return this.events=this.events||{},this.events}getEventCallbacks(e){return this._events[e]||{}}getEventCallbackName(e){return e.name.length?e.name:"anonymousFunction"}getEventCallbackGroup(e,t){return e[t]||[]}on(e,t){var s=this.getEventCallbacks(e),i=this.getEventCallbackName(t),n=this.getEventCallbackGroup(s,i);return n.push(t),s[i]=n,this._events[e]=s,this}off(){switch(arguments.length){case 0:delete this.events;break;case 1:var e=arguments[0];delete this._events[e];break;case 2:e=arguments[0];var t=arguments[1],s="string"==typeof t?t:this.getEventCallbackName(t);this._events[e]&&(delete this._events[e][s],0===Object.keys(this._events[e]).length&&delete this._events[e])}return this}emit(e,t){var s=Object.values(arguments),i=Object.entries(this.getEventCallbacks(e));for(var[n,r]of i)for(var l of r){l(t,...s.splice(2)||[])}return this}};_default=Events;exports.default=_default,Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;_index=_interopRequireDefault(require("../Utils/index")),_index2=_interopRequireDefault(require("../Base/index"));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}var View=class extends _index2.default{constructor(){return super(...arguments),this.enable(),this}get elementKeyMap(){return["elementName","element","attributes","templates","insert"]}get uiKeyMap(){return["ui","uiCallbacks","uiEvents"]}get _elementName(){return this._element.tagName}set _elementName(e){this._element||(this._element=document.createElement(e))}get _element(){return this.element}set _element(e){e instanceof HTMLElement||e instanceof Document?this.element=e:"string"==typeof e&&(this.element=document.querySelector(e)),this.elementObserver.observe(this.element,{subtree:!0,childList:!0})}get _attributes(){return this._element.attributes}set _attributes(e){for(var[t,s]of Object.entries(e))void 0===s?this._element.removeAttribute(t):this._element.setAttribute(t,s)}get ui(){return this._ui}get _ui(){var e={};return e[":scope"]=this.element,Object.entries(this.uiElements).forEach(t=>{var[s,i]=t;if("string"==typeof i){var n=new RegExp(/^(\:scope(\W){0,}>{0,})/);i=i.replace(n,""),e[s]=this.element.querySelectorAll(i)}else(i instanceof HTMLElement||i instanceof Document)&&(e[s]=i)}),e}set _ui(e){this.uiElements=e}get _uiEvents(){return this.uiEvents}set _uiEvents(e){this.uiEvents=e}get _uiCallbacks(){return this.uiCallbacks=this.uiCallbacks||{},this.uiCallbacks}set _uiCallbacks(e){this.uiCallbacks=_index.default.addPropertiesToObject(e,this._uiCallbacks)}get _observerCallbacks(){return this.observerCallbacks=this.observerCallbacks||{},this.observerCallbacks}set _observerCallbacks(e){this.observerCallbacks=_index.default.addPropertiesToObject(e,this._observerCallbacks)}get elementObserver(){return this._elementObserver=this._elementObserver||new MutationObserver(this.elementObserve.bind(this)),this._elementObserver}get _insert(){return this.insert}set _insert(e){this.insert=e}get _enabled(){return this.enabled||!1}set _enabled(e){this.enabled=e}get _templates(){return this.templates=this.templates||{},this.templates}set _templates(e){this.templates=_index.default.addPropertiesToObject(e,this._templates)}elementObserve(e,t){for(var[s,i]of Object.entries(e))switch(i.type){case"childList":for(var n of["addedNodes","removedNodes"])i[n].length&&this.resetUI()}}autoInsert(){var e;this.insert&&((e="string"===_index.default.typeOf(this.insert.element)?document.querySelectorAll(this.insert.element):this.insert.element)instanceof HTMLElement||e instanceof Node?e.insertAdjacentElement(this.insert.method,this.element):e instanceof NodeList&&e.forEach(e=>{e.insertAdjacentElement(this.insert.method,this.element)}));return this}autoRemove(){return this.element&&this.element.parentElement&&this.element.parentElement.removeChild(this.element),this}enableElement(){return this.setProperties(this.settings||{},this.elementKeyMap)}disableElement(){return this.deleteProperties(this.settings||{},this.elementKeyMap)}resetUI(){return this.disableUI().enableUI()}enableUI(){return this.setProperties(this.settings||{},this.uiKeyMap).enableUIEvents()}disableUI(){return this.disableUIEvents().deleteProperties(this.settings||{},this.uiKeyMap)}enableUIEvents(){return this.uiEvents&&this.ui&&this.uiCallbacks&&_index.default.bindEventsToTargetViewObjects(this.uiEvents,this.ui,this.uiCallbacks),this}enableRenderers(){var e=this.settings||{};return _index.default.objectQuery("[/^render.*?/]",e).forEach(e=>{var[t,s]=e;this[t]=s}),this}disableRenderers(){var e=this.settings||{};return _index.default.objectQuery("[/^render.*?/]",e).forEach((e,t)=>{delete this[e]}),this}disableUIEvents(){return this.uiEvents&&this.ui&&this.uiCallbacks&&_index.default.unbindEventsFromTargetViewObjects(this.uiEvents,this.ui,this.uiCallbacks),this}enable(){this.settings;return this._enabled||(this.enableRenderers().enableElement().enableUI()._enabled=!0),this}disable(){return this._enabled&&(this.disableRenderers().disableUI().disableElement()._enabled=!1),this}};_default=View;exports.default=_default;