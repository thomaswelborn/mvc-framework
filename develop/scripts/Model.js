class Model extends Events {
  constructor(settings) {
    super();
    Object.assign(this, settings, { settings: settings });
    this.data = {};
    this._data = this.settings.data;
    this.setAll(this._data);
    try {
      this.initialize();
    } catch(error) {}
  }
  fetch(settings, url) {
    return new AJAX('GET', url || this.url, settings || {});
  }
  add(settings, url) {
    return new AJAX('POST', url || this.url, settings || {});
  }
  update(settings, url) {
    return new AJAX('PUT', url || this.url, settings || {});
  }
  remove(settings, url) {
    return new AJAX('DELETE', url || this.url, settings || {});
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
          _this.trigger('set', {
            original: original,
            current: _this._data,
          });
          _this.trigger(String.prototype.concat('set', ':', key), {
            original: original[key],
            current: _this._data[key],
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
      this.trigger(String.prototype.concat('unset', ':', key), this._data);
    }
  }
  get(key) {
    return (key) ? this.data[key] : this._data;
  }
}
