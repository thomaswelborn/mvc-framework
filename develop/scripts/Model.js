class Model extends Events {
  constructor(settings) {
    super();
    Object.assign(this, settings, { settings: settings });
    if(typeof this.data === 'object') this.setAll(this.data);
    if(typeof this.initialize === 'function') this.initialize();
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
    if(typeof data === 'object') {
      this.data = eval(Array('new', ' ', data.constructor.name, '()').join(''));
      this._data = data;
      if(Array.isArray(data)) {
        for(var key in data) {
          if(data[key].constructor.name !== 'Model') {
            data[key] = new Model({
              data: data[key]
            });
            data[key].on('set', function(data) {
              this.trigger('set', data);
            }.bind(this));
          }
          this.set(this.data.length, data[key]);
        }
      } else {
        for(var key in data) {
          this.set(key, data[key]);
        }
      }
    } 
  }
  set(key, value) {
    if(typeof this.data[key] === 'undefined') this.setProperty(this, key, value);
    if(
      typeof key === 'number' && 
      value.constructor.name !== 'Model'
    ) value = new Model({ data: value });
    this.data[key] = value;
  }
  setProperty(context, key, value) {
    Object.defineProperty(context.data, key, {
      get() {
        return context._data[key];
      },
      set(value) {
        var original = Object.assign({}, context._data);
        context._data[key] = value;
        context.trigger('set', {
          original: original,
          current: context._data,
        });
        context.trigger(String.prototype.concat('set', ':', key), {
          original: original[key],
          current: context._data[key],
        });
      },
    });
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
    if(key) return this.data[key];
    return this._data;
  }
  parse() {
    var data = eval(Array('new', ' ', this.data.constructor.name, '()').join(''));
    for(var key in this._data) {
      if(this._data[key] instanceof Model) {
        data[key] = this._data[key].parse();
      } else {
        data[key] = this._data[key];
      }
    }
    return JSON.parse(JSON.stringify(data));
  }
}
