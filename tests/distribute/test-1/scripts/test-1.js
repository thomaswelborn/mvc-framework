class Model extends MVC.Model {
  constructor() {
    super(...arguments);
  }

}

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
  , __lines = "<div class=\"some-class\">\r\n  <p><%= locals.a %></p>\r\n  <p><%= locals.b %></p>\r\n  <p><%= locals.c %></p>\r\n</div>\r\n"
  , __filename = undefined;
try {
  var __output = [], __append = __output.push.bind(__output);
    ; __append("<div class=\"some-class\">\r\n  <p>")
    ; __line = 2
    ; __append(escapeFn( locals.a ))
    ; __append("</p>\r\n  <p>")
    ; __line = 3
    ; __append(escapeFn( locals.b ))
    ; __append("</p>\r\n  <p>")
    ; __line = 4
    ; __append(escapeFn( locals.c ))
    ; __append("</p>\r\n</div>\r\n")
    ; __line = 6;
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

var model = new Model({
  localStorage: {
    endpoint: '/test-1'
  },
  defaults: {
    a: 3,
    b: 2,
    c: 1
  }
}); // model.on('set', (event, model) => console.log(model.db) )
// model.on('set:a', (event, model) => console.log(model.db) )
// model.on('set:b', (event, model) => console.log(model.db) )
// model.on('set:c', (event, model) => console.log(model.db) )

model.set({
  a: 1,
  b: 2,
  c: 3
});
var view = new View();
view.render(model.get());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC0xLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb3VyY2UvdGVzdC0xL21vZHVsZS1hL21vZGVsLmpzIiwiLi4vLi4vLi4vc291cmNlL3Rlc3QtMS9tb2R1bGUtYS92aWV3LmpzIiwiLi4vLi4vLi4vc291cmNlL3Rlc3QtMS9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBNb2RlbCBleHRlbmRzIE1WQy5Nb2RlbCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IE1vZGVsXHJcbiIsImltcG9ydCBUZW1wbGF0ZSBmcm9tICcuL3RlbXBsYXRlLmVqcydcclxuY2xhc3MgVmlldyBleHRlbmRzIE1WQy5WaWV3IHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKClcclxuICB9XHJcbiAgZ2V0IGVsZW1lbnROYW1lKCkgeyByZXR1cm4gJ3NlY3Rpb24nIH1cclxuICBnZXQgYXR0cmlidXRlcygpIHsgcmV0dXJuIHtcclxuICAgICdjbGFzcyc6ICdtZWgnLFxyXG4gIH0gfVxyXG4gIGdldCB1aUVsZW1lbnRzKCkgeyByZXR1cm4ge1xyXG4gICAgJ3NvbWVDbGFzcyc6ICc6c2NvcGUgPiAuc29tZS1jbGFzcycsXHJcbiAgfSB9XHJcbiAgZ2V0IHVpRWxlbWVudEV2ZW50cygpIHsgcmV0dXJuIHtcclxuICAgICdzb21lQ2xhc3MgY2xpY2snOiAnc29tZUNsYXNzQ2xpY2snLFxyXG4gIH0gfVxyXG4gIGdldCB1aUVsZW1lbnRDYWxsYmFja3MoKSB7IHJldHVybiB7XHJcbiAgICAnc29tZUNsYXNzQ2xpY2snOiBmdW5jdGlvbiBzb21lQ2xhc3NDbGljayhldmVudCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhldmVudClcclxuICAgIH0sXHJcbiAgfSB9XHJcbiAgZ2V0IGluc2VydCgpIHsgcmV0dXJuIHtcclxuICAgIGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSxcclxuICAgIG1ldGhvZDogJ2FmdGVyQmVnaW4nXHJcbiAgfSB9XHJcbiAgZ2V0IHRlbXBsYXRlcygpIHsgcmV0dXJuIHtcclxuICAgIHRlbXBsYXRlOiBUZW1wbGF0ZVxyXG4gIH0gfVxyXG4gIHJlbmRlcihkYXRhKSB7XHJcbiAgICBsZXQgdGVtcGxhdGVTdHJpbmcgPSB0aGlzLnRlbXBsYXRlcy50ZW1wbGF0ZShkYXRhKVxyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxyXG4gICAgfSBjYXRjaChlcnJvcikge31cclxuICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZVN0cmluZ1xyXG4gICAgdGhpcy5hdXRvSW5zZXJ0KClcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICB0aGlzLnJlbmRlcihkYXRhKVxyXG4gICAgfSwgNTAwMClcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFZpZXdcclxuIiwiaW1wb3J0IE1vZGVsIGZyb20gJy4vbW9kdWxlLWEvbW9kZWwnXHJcbmltcG9ydCBWaWV3IGZyb20gJy4vbW9kdWxlLWEvdmlldydcclxubGV0IG1vZGVsID0gbmV3IE1vZGVsKHtcclxuICBsb2NhbFN0b3JhZ2U6IHtcclxuICAgIGVuZHBvaW50OiAnL3Rlc3QtMScsXHJcbiAgfSxcclxuICBkZWZhdWx0czoge1xyXG4gICAgYTogMyxcclxuICAgIGI6IDIsXHJcbiAgICBjOiAxLFxyXG4gIH0sXHJcbn0pXHJcbi8vIG1vZGVsLm9uKCdzZXQnLCAoZXZlbnQsIG1vZGVsKSA9PiBjb25zb2xlLmxvZyhtb2RlbC5kYikgKVxyXG4vLyBtb2RlbC5vbignc2V0OmEnLCAoZXZlbnQsIG1vZGVsKSA9PiBjb25zb2xlLmxvZyhtb2RlbC5kYikgKVxyXG4vLyBtb2RlbC5vbignc2V0OmInLCAoZXZlbnQsIG1vZGVsKSA9PiBjb25zb2xlLmxvZyhtb2RlbC5kYikgKVxyXG4vLyBtb2RlbC5vbignc2V0OmMnLCAoZXZlbnQsIG1vZGVsKSA9PiBjb25zb2xlLmxvZyhtb2RlbC5kYikgKVxyXG5tb2RlbC5zZXQoe1xyXG4gIGE6IDEsXHJcbiAgYjogMixcclxuICBjOiAzLFxyXG59KVxyXG5sZXQgdmlldyA9IG5ldyBWaWV3KClcclxudmlldy5yZW5kZXIobW9kZWwuZ2V0KCkpXHJcbiJdLCJuYW1lcyI6WyJNb2RlbCIsIk1WQyIsImNvbnN0cnVjdG9yIiwiYXJndW1lbnRzIiwiVmlldyIsImVsZW1lbnROYW1lIiwiYXR0cmlidXRlcyIsInVpRWxlbWVudHMiLCJ1aUVsZW1lbnRFdmVudHMiLCJ1aUVsZW1lbnRDYWxsYmFja3MiLCJzb21lQ2xhc3NDbGljayIsImV2ZW50IiwiY29uc29sZSIsImxvZyIsImluc2VydCIsImVsZW1lbnQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJtZXRob2QiLCJ0ZW1wbGF0ZXMiLCJ0ZW1wbGF0ZSIsIlRlbXBsYXRlIiwicmVuZGVyIiwiZGF0YSIsInRlbXBsYXRlU3RyaW5nIiwicGFyZW50RWxlbWVudCIsInJlbW92ZUNoaWxkIiwiZXJyb3IiLCJpbm5lckhUTUwiLCJhdXRvSW5zZXJ0Iiwic2V0VGltZW91dCIsIm1vZGVsIiwibG9jYWxTdG9yYWdlIiwiZW5kcG9pbnQiLCJkZWZhdWx0cyIsImEiLCJiIiwiYyIsInNldCIsInZpZXciLCJnZXQiXSwibWFwcGluZ3MiOiJBQUFBLE1BQU1BLEtBQU4sU0FBb0JDLEdBQUcsQ0FBQ0QsS0FBeEIsQ0FBOEI7RUFDNUJFLFdBQVcsR0FBRztVQUNOLEdBQUdDLFNBQVQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0RKLE1BQU1DLElBQU4sU0FBbUJILEdBQUcsQ0FBQ0csSUFBdkIsQ0FBNEI7RUFDMUJGLFdBQVcsR0FBRzs7OztNQUdWRyxXQUFKLEdBQWtCO1dBQVMsU0FBUDs7O01BQ2hCQyxVQUFKLEdBQWlCO1dBQVM7ZUFDZjtLQURROzs7TUFHZkMsVUFBSixHQUFpQjtXQUFTO21CQUNYO0tBREk7OztNQUdmQyxlQUFKLEdBQXNCO1dBQVM7eUJBQ1Y7S0FERzs7O01BR3BCQyxrQkFBSixHQUF5QjtXQUFTO3dCQUNkLFNBQVNDLGNBQVQsQ0FBd0JDLEtBQXhCLEVBQStCO1FBQy9DQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUYsS0FBWjs7S0FGdUI7OztNQUt2QkcsTUFBSixHQUFhO1dBQVM7TUFDcEJDLE9BQU8sRUFBRUMsUUFBUSxDQUFDQyxhQUFULENBQXVCLE1BQXZCLENBRFc7TUFFcEJDLE1BQU0sRUFBRTtLQUZLOzs7TUFJWEMsU0FBSixHQUFnQjtXQUFTO01BQ3ZCQyxRQUFRLEVBQUVDO0tBRE07OztFQUdsQkMsTUFBTSxDQUFDQyxJQUFELEVBQU87UUFDUEMsY0FBYyxHQUFHLEtBQUtMLFNBQUwsQ0FBZUMsUUFBZixDQUF3QkcsSUFBeEIsQ0FBckI7O1FBQ0k7V0FDR1IsT0FBTCxDQUFhVSxhQUFiLENBQTJCQyxXQUEzQixDQUF1QyxLQUFLWCxPQUE1QztLQURGLENBRUUsT0FBTVksS0FBTixFQUFhOztTQUNWWixPQUFMLENBQWFhLFNBQWIsR0FBeUJKLGNBQXpCO1NBQ0tLLFVBQUw7SUFDQUMsVUFBVSxDQUFDLE1BQU07V0FDVlIsTUFBTCxDQUFZQyxJQUFaO0tBRFEsRUFFUCxJQUZPLENBQVY7V0FHTyxJQUFQOzs7OztBQ25DSixJQUFJUSxLQUFLLEdBQUcsSUFBSS9CLEtBQUosQ0FBVTtFQUNwQmdDLFlBQVksRUFBRTtJQUNaQyxRQUFRLEVBQUU7R0FGUTtFQUlwQkMsUUFBUSxFQUFFO0lBQ1JDLENBQUMsRUFBRSxDQURLO0lBRVJDLENBQUMsRUFBRSxDQUZLO0lBR1JDLENBQUMsRUFBRTs7Q0FQSyxDQUFaOzs7OztBQWNBTixLQUFLLENBQUNPLEdBQU4sQ0FBVTtFQUNSSCxDQUFDLEVBQUUsQ0FESztFQUVSQyxDQUFDLEVBQUUsQ0FGSztFQUdSQyxDQUFDLEVBQUU7Q0FITDtBQUtBLElBQUlFLElBQUksR0FBRyxJQUFJbkMsSUFBSixFQUFYO0FBQ0FtQyxJQUFJLENBQUNqQixNQUFMLENBQVlTLEtBQUssQ0FBQ1MsR0FBTixFQUFaIn0=
