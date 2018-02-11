class Model extends Events {
  constructor(settings) {
    super();
    this.settings = settings || {};
    this.data = {};
    this._data = this.settings.data;
    this.setAll(this.settings.data);
    delete this.settings.data;
    for(var key in this.settings) {
      this[key] = this.settings[key];
    }
    try {
      this.initialize();
    } catch(error) {}
  }
  fetch(settings) {
    return new AJAX('GET', this.url || url, settings || {});
  }
  add(settings) {
    return new AJAX('POST', this.url || url, settings || {});
  }
  update(settings) {
    return new AJAX('PUT', this.url || url, settings || {});
  }
  remove(settings) {
    return new AJAX('DELETE', this.url || url, settings || {});
  }
  setAll(data) {
    for(var key in data) {
      this.set(key, data[key]);
    }
  }
  set(key, value) {
    if(typeof this.data[key] === 'undefined') {
      var _this = this;
      Object.defineProperty(this.data, key, {
        get() {
          return _this._data[key];
        },
        set(value) {
          var original = Object.assign({}, _this._data);
          _this._data[key] = value;
          _this.trigger('change', {
            original: original,
            data: _this._data,
          });
          _this.trigger(String.prototype.concat('change', ':', key), {
            original: original[key],
            data: _this._data[key],
          });
        },
      });
    } else {
      this.data[key] = value;
    }
  }
  unsetAll() {
    Object.entries(this._data).forEach(function(element) {
      this.unset(element[0]);
    }.bind(this));
  }
  unset(key) {
    if(typeof this.data[key] !== 'undefined') {
      delete this.data[key];
      delete this._data[key];
    }
  }
  get(key) {
    return (key) ? this.data[key] : this._data;
  }
}