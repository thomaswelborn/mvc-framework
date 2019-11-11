function anonymous(locals, escapeFn, include, rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc){
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm); // eslint-disable-line
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
}var __line = 1
  , __lines = "<div class=\"some-class\">\r\n  <%= locals.a %>\r\n</div>\r\n"
  , __filename = undefined;
try {
  var __output = [], __append = __output.push.bind(__output);
    ; __append("<div class=\"some-class\">\r\n  ")
    ; __line = 2
    ; __append(escapeFn( locals.a ))
    ; __append("\r\n</div>\r\n")
    ; __line = 4;
  return __output.join("");
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}

class View extends MVC.View {
  constructor() {
    super();
  }

  get elementName() {
    return 'section';
  }

  get attributes() {
    return {
      'class': 'meh'
    };
  }

  get uiElements() {
    return {
      'someClass': ':scope > .some-class'
    };
  }

  get uiElementEvents() {
    return {
      'someClass click': 'someClassClick'
    };
  }

  get uiElementCallbacks() {
    return {
      'someClassClick': function someClassClick(event) {
        console.log(event);
      }
    };
  }

  get insert() {
    return {
      element: document.querySelector('body'),
      method: 'afterBegin'
    };
  }

  get templates() {
    return {
      template: anonymous
    };
  }

  render(data) {
    var templateString = this.templates.template(data);

    try {
      this.element.parentElement.removeChild(this.element);
    } catch (error) {}

    this.element.innerHTML = templateString;
    this.autoInsert();
    setTimeout(() => {
      this.render(data);
    }, 5000);
    return this;
  }

}

var view = new View();
view.render({
  a: 15
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC0xLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb3VyY2UvdGVzdC0xL21vZHVsZS1hL3ZpZXcuanMiLCIuLi8uLi8uLi9zb3VyY2UvdGVzdC0xL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZW1wbGF0ZSBmcm9tICcuL3RlbXBsYXRlLmVqcydcclxuY2xhc3MgVmlldyBleHRlbmRzIE1WQy5WaWV3IHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKClcclxuICB9XHJcbiAgZ2V0IGVsZW1lbnROYW1lKCkgeyByZXR1cm4gJ3NlY3Rpb24nIH1cclxuICBnZXQgYXR0cmlidXRlcygpIHsgcmV0dXJuIHtcclxuICAgICdjbGFzcyc6ICdtZWgnLFxyXG4gIH0gfVxyXG4gIGdldCB1aUVsZW1lbnRzKCkgeyByZXR1cm4ge1xyXG4gICAgJ3NvbWVDbGFzcyc6ICc6c2NvcGUgPiAuc29tZS1jbGFzcycsXHJcbiAgfSB9XHJcbiAgZ2V0IHVpRWxlbWVudEV2ZW50cygpIHsgcmV0dXJuIHtcclxuICAgICdzb21lQ2xhc3MgY2xpY2snOiAnc29tZUNsYXNzQ2xpY2snLFxyXG4gIH0gfVxyXG4gIGdldCB1aUVsZW1lbnRDYWxsYmFja3MoKSB7IHJldHVybiB7XHJcbiAgICAnc29tZUNsYXNzQ2xpY2snOiBmdW5jdGlvbiBzb21lQ2xhc3NDbGljayhldmVudCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhldmVudClcclxuICAgIH0sXHJcbiAgfSB9XHJcbiAgZ2V0IGluc2VydCgpIHsgcmV0dXJuIHtcclxuICAgIGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSxcclxuICAgIG1ldGhvZDogJ2FmdGVyQmVnaW4nXHJcbiAgfSB9XHJcbiAgZ2V0IHRlbXBsYXRlcygpIHsgcmV0dXJuIHtcclxuICAgIHRlbXBsYXRlOiBUZW1wbGF0ZVxyXG4gIH0gfVxyXG4gIHJlbmRlcihkYXRhKSB7XHJcbiAgICBsZXQgdGVtcGxhdGVTdHJpbmcgPSB0aGlzLnRlbXBsYXRlcy50ZW1wbGF0ZShkYXRhKVxyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxyXG4gICAgfSBjYXRjaChlcnJvcikge31cclxuICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZVN0cmluZ1xyXG4gICAgdGhpcy5hdXRvSW5zZXJ0KClcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICB0aGlzLnJlbmRlcihkYXRhKVxyXG4gICAgfSwgNTAwMClcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFZpZXdcclxuIiwiaW1wb3J0IFZpZXcgZnJvbSAnLi9tb2R1bGUtYS92aWV3J1xyXG5sZXQgdmlldyA9IG5ldyBWaWV3KClcclxudmlldy5yZW5kZXIoe1xyXG4gIGE6IDE1XHJcbn0pXHJcbiJdLCJuYW1lcyI6WyJWaWV3IiwiTVZDIiwiY29uc3RydWN0b3IiLCJlbGVtZW50TmFtZSIsImF0dHJpYnV0ZXMiLCJ1aUVsZW1lbnRzIiwidWlFbGVtZW50RXZlbnRzIiwidWlFbGVtZW50Q2FsbGJhY2tzIiwic29tZUNsYXNzQ2xpY2siLCJldmVudCIsImNvbnNvbGUiLCJsb2ciLCJpbnNlcnQiLCJlbGVtZW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwibWV0aG9kIiwidGVtcGxhdGVzIiwidGVtcGxhdGUiLCJUZW1wbGF0ZSIsInJlbmRlciIsImRhdGEiLCJ0ZW1wbGF0ZVN0cmluZyIsInBhcmVudEVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsImVycm9yIiwiaW5uZXJIVE1MIiwiYXV0b0luc2VydCIsInNldFRpbWVvdXQiLCJ2aWV3IiwiYSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLE1BQU1BLElBQU4sU0FBbUJDLEdBQUcsQ0FBQ0QsSUFBdkIsQ0FBNEI7RUFDMUJFLFdBQVcsR0FBRzs7OztNQUdWQyxXQUFKLEdBQWtCO1dBQVMsU0FBUDs7O01BQ2hCQyxVQUFKLEdBQWlCO1dBQVM7ZUFDZjtLQURROzs7TUFHZkMsVUFBSixHQUFpQjtXQUFTO21CQUNYO0tBREk7OztNQUdmQyxlQUFKLEdBQXNCO1dBQVM7eUJBQ1Y7S0FERzs7O01BR3BCQyxrQkFBSixHQUF5QjtXQUFTO3dCQUNkLFNBQVNDLGNBQVQsQ0FBd0JDLEtBQXhCLEVBQStCO1FBQy9DQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUYsS0FBWjs7S0FGdUI7OztNQUt2QkcsTUFBSixHQUFhO1dBQVM7TUFDcEJDLE9BQU8sRUFBRUMsUUFBUSxDQUFDQyxhQUFULENBQXVCLE1BQXZCLENBRFc7TUFFcEJDLE1BQU0sRUFBRTtLQUZLOzs7TUFJWEMsU0FBSixHQUFnQjtXQUFTO01BQ3ZCQyxRQUFRLEVBQUVDO0tBRE07OztFQUdsQkMsTUFBTSxDQUFDQyxJQUFELEVBQU87UUFDUEMsY0FBYyxHQUFHLEtBQUtMLFNBQUwsQ0FBZUMsUUFBZixDQUF3QkcsSUFBeEIsQ0FBckI7O1FBQ0k7V0FDR1IsT0FBTCxDQUFhVSxhQUFiLENBQTJCQyxXQUEzQixDQUF1QyxLQUFLWCxPQUE1QztLQURGLENBRUUsT0FBTVksS0FBTixFQUFhOztTQUNWWixPQUFMLENBQWFhLFNBQWIsR0FBeUJKLGNBQXpCO1NBQ0tLLFVBQUw7SUFDQUMsVUFBVSxDQUFDLE1BQU07V0FDVlIsTUFBTCxDQUFZQyxJQUFaO0tBRFEsRUFFUCxJQUZPLENBQVY7V0FHTyxJQUFQOzs7OztBQ3BDSixJQUFJUSxJQUFJLEdBQUcsSUFBSTdCLElBQUosRUFBWDtBQUNBNkIsSUFBSSxDQUFDVCxNQUFMLENBQVk7RUFDVlUsQ0FBQyxFQUFFO0NBREwifQ==
