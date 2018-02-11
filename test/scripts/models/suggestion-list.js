AutoSuggest.Models.SuggestionList = function(settings) {
  return new Model(Object.assign(settings || {}, {
    onQueryStringChange: function(value) {
      if(typeof this.xhr === 'object') this.xhr.abort();
      this.data.queryString = value;
      var queryURL = String.prototype.concat(
        this.baseURL,
        '/sug',
        '?', 's', '=', value,
        '&', 'max', '=', 5
      );
      this
        .fetch(queryURL)
        .then(function(response) {
          console.log(response);
          this.set('results', response);
        }.bind(this));
    },
  }));
}
