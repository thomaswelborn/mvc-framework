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

class Controller extends MVC.Controller {
  constructor() {
    super(...arguments);
  }

  get models() {
    return {
      model: new Model({
        defaults: {
          a: 1,
          b: 2,
          c: 3
        }
      })
    };
  }

  get views() {
    return {
      view: new View()
    };
  }

  start() {
    this.views.view.render(this.models.model.get());
  }

}

// import Model from './module-a/model'
var controller = new Controller();
controller.start();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC0xLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb3VyY2UvdGVzdC0xL21vZHVsZS1hL21vZGVsLmpzIiwiLi4vLi4vLi4vc291cmNlL3Rlc3QtMS9tb2R1bGUtYS92aWV3LmpzIiwiLi4vLi4vLi4vc291cmNlL3Rlc3QtMS9tb2R1bGUtYS9jb250cm9sbGVyLmpzIiwiLi4vLi4vLi4vc291cmNlL3Rlc3QtMS9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBNb2RlbCBleHRlbmRzIE1WQy5Nb2RlbCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IE1vZGVsXHJcbiIsImltcG9ydCBUZW1wbGF0ZSBmcm9tICcuL3RlbXBsYXRlLmVqcydcclxuY2xhc3MgVmlldyBleHRlbmRzIE1WQy5WaWV3IHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKClcclxuICB9XHJcbiAgZ2V0IGVsZW1lbnROYW1lKCkgeyByZXR1cm4gJ3NlY3Rpb24nIH1cclxuICBnZXQgYXR0cmlidXRlcygpIHsgcmV0dXJuIHtcclxuICAgICdjbGFzcyc6ICdtZWgnLFxyXG4gIH0gfVxyXG4gIGdldCB1aUVsZW1lbnRzKCkgeyByZXR1cm4ge1xyXG4gICAgJ3NvbWVDbGFzcyc6ICc6c2NvcGUgPiAuc29tZS1jbGFzcycsXHJcbiAgfSB9XHJcbiAgZ2V0IHVpRWxlbWVudEV2ZW50cygpIHsgcmV0dXJuIHtcclxuICAgICdzb21lQ2xhc3MgY2xpY2snOiAnc29tZUNsYXNzQ2xpY2snLFxyXG4gIH0gfVxyXG4gIGdldCB1aUVsZW1lbnRDYWxsYmFja3MoKSB7IHJldHVybiB7XHJcbiAgICAnc29tZUNsYXNzQ2xpY2snOiBmdW5jdGlvbiBzb21lQ2xhc3NDbGljayhldmVudCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhldmVudClcclxuICAgIH0sXHJcbiAgfSB9XHJcbiAgZ2V0IGluc2VydCgpIHsgcmV0dXJuIHtcclxuICAgIGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSxcclxuICAgIG1ldGhvZDogJ2FmdGVyQmVnaW4nXHJcbiAgfSB9XHJcbiAgZ2V0IHRlbXBsYXRlcygpIHsgcmV0dXJuIHtcclxuICAgIHRlbXBsYXRlOiBUZW1wbGF0ZVxyXG4gIH0gfVxyXG4gIHJlbmRlcihkYXRhKSB7XHJcbiAgICBsZXQgdGVtcGxhdGVTdHJpbmcgPSB0aGlzLnRlbXBsYXRlcy50ZW1wbGF0ZShkYXRhKVxyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxyXG4gICAgfSBjYXRjaChlcnJvcikge31cclxuICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZVN0cmluZ1xyXG4gICAgdGhpcy5hdXRvSW5zZXJ0KClcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICB0aGlzLnJlbmRlcihkYXRhKVxyXG4gICAgfSwgNTAwMClcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFZpZXdcclxuIiwiaW1wb3J0IE1vZGVsIGZyb20gJy4vbW9kZWwnXHJcbmltcG9ydCBWaWV3IGZyb20gJy4vdmlldydcclxuY2xhc3MgQ29udHJvbGxlciBleHRlbmRzIE1WQy5Db250cm9sbGVyIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICB9XHJcbiAgZ2V0IG1vZGVscygpIHsgcmV0dXJuIHtcclxuICAgIG1vZGVsOiBuZXcgTW9kZWwoe1xyXG4gICAgICBkZWZhdWx0czoge1xyXG4gICAgICAgIGE6IDEsXHJcbiAgICAgICAgYjogMixcclxuICAgICAgICBjOiAzLFxyXG4gICAgICB9LFxyXG4gICAgfSlcclxuICB9IH1cclxuICBnZXQgdmlld3MoKSB7IHJldHVybiB7XHJcbiAgICB2aWV3OiBuZXcgVmlldygpLFxyXG4gIH0gfVxyXG4gIHN0YXJ0KCkge1xyXG4gICAgdGhpcy52aWV3cy52aWV3LnJlbmRlcih0aGlzLm1vZGVscy5tb2RlbC5nZXQoKSlcclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQ29udHJvbGxlclxyXG4iLCIvLyBpbXBvcnQgTW9kZWwgZnJvbSAnLi9tb2R1bGUtYS9tb2RlbCdcclxuLy8gaW1wb3J0IFZpZXcgZnJvbSAnLi9tb2R1bGUtYS92aWV3J1xyXG4vLyBsZXQgbW9kZWwgPSBuZXcgTW9kZWwoe1xyXG4vLyAgIGxvY2FsU3RvcmFnZToge1xyXG4vLyAgICAgZW5kcG9pbnQ6ICcvdGVzdC0xJyxcclxuLy8gICB9LFxyXG4vLyAgIGRlZmF1bHRzOiB7XHJcbi8vICAgICBhOiAzLFxyXG4vLyAgICAgYjogMixcclxuLy8gICAgIGM6IDEsXHJcbi8vICAgfSxcclxuLy8gfSlcclxuLy8gLy8gbW9kZWwub24oJ3NldCcsIChldmVudCwgbW9kZWwpID0+IGNvbnNvbGUubG9nKG1vZGVsLmRiKSApXHJcbi8vIC8vIG1vZGVsLm9uKCdzZXQ6YScsIChldmVudCwgbW9kZWwpID0+IGNvbnNvbGUubG9nKG1vZGVsLmRiKSApXHJcbi8vIC8vIG1vZGVsLm9uKCdzZXQ6YicsIChldmVudCwgbW9kZWwpID0+IGNvbnNvbGUubG9nKG1vZGVsLmRiKSApXHJcbi8vIC8vIG1vZGVsLm9uKCdzZXQ6YycsIChldmVudCwgbW9kZWwpID0+IGNvbnNvbGUubG9nKG1vZGVsLmRiKSApXHJcbi8vIG1vZGVsLnNldCh7XHJcbi8vICAgYTogMSxcclxuLy8gICBiOiAyLFxyXG4vLyAgIGM6IDMsXHJcbi8vIH0pXHJcbi8vIGxldCB2aWV3ID0gbmV3IFZpZXcoKVxyXG4vLyB2aWV3LnJlbmRlcihtb2RlbC5nZXQoKSlcclxuaW1wb3J0IENvbnRyb2xsZXIgZnJvbSAnLi9tb2R1bGUtYS9jb250cm9sbGVyJ1xyXG5sZXQgY29udHJvbGxlciA9IG5ldyBDb250cm9sbGVyKClcclxuY29udHJvbGxlci5zdGFydCgpXHJcbiJdLCJuYW1lcyI6WyJNb2RlbCIsIk1WQyIsImNvbnN0cnVjdG9yIiwiYXJndW1lbnRzIiwiVmlldyIsImVsZW1lbnROYW1lIiwiYXR0cmlidXRlcyIsInVpRWxlbWVudHMiLCJ1aUVsZW1lbnRFdmVudHMiLCJ1aUVsZW1lbnRDYWxsYmFja3MiLCJzb21lQ2xhc3NDbGljayIsImV2ZW50IiwiY29uc29sZSIsImxvZyIsImluc2VydCIsImVsZW1lbnQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJtZXRob2QiLCJ0ZW1wbGF0ZXMiLCJ0ZW1wbGF0ZSIsIlRlbXBsYXRlIiwicmVuZGVyIiwiZGF0YSIsInRlbXBsYXRlU3RyaW5nIiwicGFyZW50RWxlbWVudCIsInJlbW92ZUNoaWxkIiwiZXJyb3IiLCJpbm5lckhUTUwiLCJhdXRvSW5zZXJ0Iiwic2V0VGltZW91dCIsIkNvbnRyb2xsZXIiLCJtb2RlbHMiLCJtb2RlbCIsImRlZmF1bHRzIiwiYSIsImIiLCJjIiwidmlld3MiLCJ2aWV3Iiwic3RhcnQiLCJnZXQiLCJjb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiQUFBQSxNQUFNQSxLQUFOLFNBQW9CQyxHQUFHLENBQUNELEtBQXhCLENBQThCO0VBQzVCRSxXQUFXLEdBQUc7VUFDTixHQUFHQyxTQUFUOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNESixNQUFNQyxJQUFOLFNBQW1CSCxHQUFHLENBQUNHLElBQXZCLENBQTRCO0VBQzFCRixXQUFXLEdBQUc7Ozs7TUFHVkcsV0FBSixHQUFrQjtXQUFTLFNBQVA7OztNQUNoQkMsVUFBSixHQUFpQjtXQUFTO2VBQ2Y7S0FEUTs7O01BR2ZDLFVBQUosR0FBaUI7V0FBUzttQkFDWDtLQURJOzs7TUFHZkMsZUFBSixHQUFzQjtXQUFTO3lCQUNWO0tBREc7OztNQUdwQkMsa0JBQUosR0FBeUI7V0FBUzt3QkFDZCxTQUFTQyxjQUFULENBQXdCQyxLQUF4QixFQUErQjtRQUMvQ0MsT0FBTyxDQUFDQyxHQUFSLENBQVlGLEtBQVo7O0tBRnVCOzs7TUFLdkJHLE1BQUosR0FBYTtXQUFTO01BQ3BCQyxPQUFPLEVBQUVDLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixNQUF2QixDQURXO01BRXBCQyxNQUFNLEVBQUU7S0FGSzs7O01BSVhDLFNBQUosR0FBZ0I7V0FBUztNQUN2QkMsUUFBUSxFQUFFQztLQURNOzs7RUFHbEJDLE1BQU0sQ0FBQ0MsSUFBRCxFQUFPO1FBQ1BDLGNBQWMsR0FBRyxLQUFLTCxTQUFMLENBQWVDLFFBQWYsQ0FBd0JHLElBQXhCLENBQXJCOztRQUNJO1dBQ0dSLE9BQUwsQ0FBYVUsYUFBYixDQUEyQkMsV0FBM0IsQ0FBdUMsS0FBS1gsT0FBNUM7S0FERixDQUVFLE9BQU1ZLEtBQU4sRUFBYTs7U0FDVlosT0FBTCxDQUFhYSxTQUFiLEdBQXlCSixjQUF6QjtTQUNLSyxVQUFMO0lBQ0FDLFVBQVUsQ0FBQyxNQUFNO1dBQ1ZSLE1BQUwsQ0FBWUMsSUFBWjtLQURRLEVBRVAsSUFGTyxDQUFWO1dBR08sSUFBUDs7Ozs7QUNuQ0osTUFBTVEsVUFBTixTQUF5QjlCLEdBQUcsQ0FBQzhCLFVBQTdCLENBQXdDO0VBQ3RDN0IsV0FBVyxHQUFHO1VBQ04sR0FBR0MsU0FBVDs7O01BRUU2QixNQUFKLEdBQWE7V0FBUztNQUNwQkMsS0FBSyxFQUFFLElBQUlqQyxLQUFKLENBQVU7UUFDZmtDLFFBQVEsRUFBRTtVQUNSQyxDQUFDLEVBQUUsQ0FESztVQUVSQyxDQUFDLEVBQUUsQ0FGSztVQUdSQyxDQUFDLEVBQUU7O09BSkE7S0FETTs7O01BU1hDLEtBQUosR0FBWTtXQUFTO01BQ25CQyxJQUFJLEVBQUUsSUFBSW5DLElBQUo7S0FETTs7O0VBR2RvQyxLQUFLLEdBQUc7U0FDREYsS0FBTCxDQUFXQyxJQUFYLENBQWdCakIsTUFBaEIsQ0FBdUIsS0FBS1UsTUFBTCxDQUFZQyxLQUFaLENBQWtCUSxHQUFsQixFQUF2Qjs7Ozs7QUNuQko7QUFDQSxBQXVCQSxJQUFJQyxVQUFVLEdBQUcsSUFBSVgsVUFBSixFQUFqQjtBQUNBVyxVQUFVLENBQUNGLEtBQVgifQ==
