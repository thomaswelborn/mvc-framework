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
    this.emit('render', {
      name: 'render',
      data: {}
    }, this);
    return this;
  }

}

class Router extends MVC.Router {
  constructor() {
    super(...arguments);
  }

  get hashRouting() {
    return true;
  }

  get root() {
    return '/test-1/';
  }

  get routes() {
    return {
      "/": {
        "name": "/",
        "callback": "index"
      },
      "/route-a": {
        "name": "/route-a",
        "callback": "route-a"
      },
      "/route-b": {
        "name": "/route-b",
        "callback": "route-b"
      },
      "/route-b/:id/edit": {
        "name": "/route-b/:id/edit",
        "callback": "route-b-id-edit"
      }
    };
  }

  get controller() {
    return {
      'index': function index(route) {// console.log('route', route)
      },
      'route-a': function routeA(route) {// console.log('route', route)
      },
      'route-b': function routeB(route) {// console.log('route', route)
      },
      'route-b-id-edit': function routeBIdEdit(route) {// console.log('route', route)
      }
    };
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

  get viewEvents() {
    return {
      'view render': 'viewRender'
    };
  }

  get viewCallbacks() {
    return {
      viewRender: function viewRender(event, view) {
        console.log(event, view);
      }
    };
  }

  get routers() {
    return {
      router: new Router()
    };
  }

  get routerEvents() {
    return {
      'router change': 'routerNavigate'
    };
  }

  get routerCallbacks() {
    return {
      'routerNavigate': function routerNavigate(event, router) {
        console.log(event, router);
      }
    };
  }

  start() {
    this.views.view.render(this.models.model.get()); // console.log(this)
  }

}

// import Model from './module-a/model'
var controller = new Controller();
controller.start();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC0xLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb3VyY2UvdGVzdC0xL21vZHVsZS1hL21vZGVsLmpzIiwiLi4vLi4vLi4vc291cmNlL3Rlc3QtMS9tb2R1bGUtYS92aWV3LmpzIiwiLi4vLi4vLi4vc291cmNlL3Rlc3QtMS9tb2R1bGUtYS9yb3V0ZXIuanMiLCIuLi8uLi8uLi9zb3VyY2UvdGVzdC0xL21vZHVsZS1hL2NvbnRyb2xsZXIuanMiLCIuLi8uLi8uLi9zb3VyY2UvdGVzdC0xL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE1vZGVsIGV4dGVuZHMgTVZDLk1vZGVsIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgTW9kZWxcclxuIiwiaW1wb3J0IFRlbXBsYXRlIGZyb20gJy4vdGVtcGxhdGUuZWpzJ1xyXG5jbGFzcyBWaWV3IGV4dGVuZHMgTVZDLlZpZXcge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoKVxyXG4gIH1cclxuICBnZXQgZWxlbWVudE5hbWUoKSB7IHJldHVybiAnc2VjdGlvbicgfVxyXG4gIGdldCBhdHRyaWJ1dGVzKCkgeyByZXR1cm4ge1xyXG4gICAgJ2NsYXNzJzogJ21laCcsXHJcbiAgfSB9XHJcbiAgZ2V0IHVpRWxlbWVudHMoKSB7IHJldHVybiB7XHJcbiAgICAnc29tZUNsYXNzJzogJzpzY29wZSA+IC5zb21lLWNsYXNzJyxcclxuICB9IH1cclxuICBnZXQgdWlFbGVtZW50RXZlbnRzKCkgeyByZXR1cm4ge1xyXG4gICAgJ3NvbWVDbGFzcyBjbGljayc6ICdzb21lQ2xhc3NDbGljaycsXHJcbiAgfSB9XHJcbiAgZ2V0IHVpRWxlbWVudENhbGxiYWNrcygpIHsgcmV0dXJuIHtcclxuICAgICdzb21lQ2xhc3NDbGljayc6IGZ1bmN0aW9uIHNvbWVDbGFzc0NsaWNrKGV2ZW50KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGV2ZW50KVxyXG4gICAgfSxcclxuICB9IH1cclxuICBnZXQgaW5zZXJ0KCkgeyByZXR1cm4ge1xyXG4gICAgZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpLFxyXG4gICAgbWV0aG9kOiAnYWZ0ZXJCZWdpbidcclxuICB9IH1cclxuICBnZXQgdGVtcGxhdGVzKCkgeyByZXR1cm4ge1xyXG4gICAgdGVtcGxhdGU6IFRlbXBsYXRlXHJcbiAgfSB9XHJcbiAgcmVuZGVyKGRhdGEpIHtcclxuICAgIGxldCB0ZW1wbGF0ZVN0cmluZyA9IHRoaXMudGVtcGxhdGVzLnRlbXBsYXRlKGRhdGEpXHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpXHJcbiAgICB9IGNhdGNoKGVycm9yKSB7fVxyXG4gICAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9IHRlbXBsYXRlU3RyaW5nXHJcbiAgICB0aGlzLmF1dG9JbnNlcnQoKVxyXG4gICAgdGhpcy5lbWl0KCdyZW5kZXInLCB7XHJcbiAgICAgIG5hbWU6ICdyZW5kZXInLFxyXG4gICAgICBkYXRhOiB7fSxcclxuICAgIH0sIHRoaXMpXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBWaWV3XHJcbiIsImNsYXNzIFJvdXRlciBleHRlbmRzIE1WQy5Sb3V0ZXIge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxyXG4gIH1cclxuICBnZXQgaGFzaFJvdXRpbmcoKSB7IHJldHVybiB0cnVlIH1cclxuICBnZXQgcm9vdCgpIHsgcmV0dXJuICcvdGVzdC0xLycgfVxyXG4gIGdldCByb3V0ZXMoKSB7IHJldHVybiB7XHJcbiAgICBcIi9cIjoge1xyXG4gICAgICBcIm5hbWVcIjogXCIvXCIsXHJcbiAgICAgIFwiY2FsbGJhY2tcIjogXCJpbmRleFwiLFxyXG4gICAgfSxcclxuICAgIFwiL3JvdXRlLWFcIjoge1xyXG4gICAgICBcIm5hbWVcIjogXCIvcm91dGUtYVwiLFxyXG4gICAgICBcImNhbGxiYWNrXCI6IFwicm91dGUtYVwiLFxyXG4gICAgfSxcclxuICAgIFwiL3JvdXRlLWJcIjoge1xyXG4gICAgICBcIm5hbWVcIjogXCIvcm91dGUtYlwiLFxyXG4gICAgICBcImNhbGxiYWNrXCI6IFwicm91dGUtYlwiLFxyXG4gICAgfSxcclxuICAgIFwiL3JvdXRlLWIvOmlkL2VkaXRcIjoge1xyXG4gICAgICBcIm5hbWVcIjogXCIvcm91dGUtYi86aWQvZWRpdFwiLFxyXG4gICAgICBcImNhbGxiYWNrXCI6IFwicm91dGUtYi1pZC1lZGl0XCIsXHJcbiAgICB9XHJcbiAgfSB9XHJcbiAgZ2V0IGNvbnRyb2xsZXIoKSB7IHJldHVybiB7XHJcbiAgICAnaW5kZXgnOiBmdW5jdGlvbihyb3V0ZSkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygncm91dGUnLCByb3V0ZSlcclxuICAgIH0sXHJcbiAgICAncm91dGUtYSc6IGZ1bmN0aW9uKHJvdXRlKSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyb3V0ZScsIHJvdXRlKVxyXG4gICAgfSxcclxuICAgICdyb3V0ZS1iJzogZnVuY3Rpb24ocm91dGUpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3JvdXRlJywgcm91dGUpXHJcbiAgICB9LFxyXG4gICAgJ3JvdXRlLWItaWQtZWRpdCc6IGZ1bmN0aW9uKHJvdXRlKSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyb3V0ZScsIHJvdXRlKVxyXG4gICAgfSxcclxuICB9IH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBSb3V0ZXJcclxuIiwiaW1wb3J0IE1vZGVsIGZyb20gJy4vbW9kZWwnXHJcbmltcG9ydCBWaWV3IGZyb20gJy4vdmlldydcclxuaW1wb3J0IFJvdXRlciBmcm9tICcuL3JvdXRlcidcclxuY2xhc3MgQ29udHJvbGxlciBleHRlbmRzIE1WQy5Db250cm9sbGVyIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICB9XHJcbiAgZ2V0IG1vZGVscygpIHsgcmV0dXJuIHtcclxuICAgIG1vZGVsOiBuZXcgTW9kZWwoe1xyXG4gICAgICBkZWZhdWx0czoge1xyXG4gICAgICAgIGE6IDEsXHJcbiAgICAgICAgYjogMixcclxuICAgICAgICBjOiAzLFxyXG4gICAgICB9LFxyXG4gICAgfSlcclxuICB9IH1cclxuICBnZXQgdmlld3MoKSB7IHJldHVybiB7XHJcbiAgICB2aWV3OiBuZXcgVmlldygpLFxyXG4gIH0gfVxyXG4gIGdldCB2aWV3RXZlbnRzKCkgeyByZXR1cm4ge1xyXG4gICAgJ3ZpZXcgcmVuZGVyJzogJ3ZpZXdSZW5kZXInLFxyXG4gIH0gfVxyXG4gIGdldCB2aWV3Q2FsbGJhY2tzKCkgeyByZXR1cm4ge1xyXG4gICAgdmlld1JlbmRlcjogZnVuY3Rpb24gdmlld1JlbmRlcihldmVudCwgdmlldykge1xyXG4gICAgICBjb25zb2xlLmxvZyhldmVudCwgdmlldylcclxuICAgIH0sXHJcbiAgfSB9XHJcbiAgZ2V0IHJvdXRlcnMoKSB7IHJldHVybiB7XHJcbiAgICByb3V0ZXI6IG5ldyBSb3V0ZXIoKSxcclxuICB9IH1cclxuICBnZXQgcm91dGVyRXZlbnRzKCkgeyByZXR1cm4ge1xyXG4gICAgJ3JvdXRlciBjaGFuZ2UnOiAncm91dGVyTmF2aWdhdGUnLFxyXG4gIH0gfVxyXG4gIGdldCByb3V0ZXJDYWxsYmFja3MoKSB7IHJldHVybiB7XHJcbiAgICAncm91dGVyTmF2aWdhdGUnOiBmdW5jdGlvbiByb3V0ZXJOYXZpZ2F0ZShldmVudCwgcm91dGVyKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCByb3V0ZXIpXHJcbiAgICB9LFxyXG4gIH0gfVxyXG4gIHN0YXJ0KCkge1xyXG4gICAgdGhpcy52aWV3cy52aWV3LnJlbmRlcih0aGlzLm1vZGVscy5tb2RlbC5nZXQoKSlcclxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMpXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IENvbnRyb2xsZXJcclxuIiwiLy8gaW1wb3J0IE1vZGVsIGZyb20gJy4vbW9kdWxlLWEvbW9kZWwnXHJcbi8vIGltcG9ydCBWaWV3IGZyb20gJy4vbW9kdWxlLWEvdmlldydcclxuLy8gbGV0IG1vZGVsID0gbmV3IE1vZGVsKHtcclxuLy8gICBsb2NhbFN0b3JhZ2U6IHtcclxuLy8gICAgIGVuZHBvaW50OiAnL3Rlc3QtMScsXHJcbi8vICAgfSxcclxuLy8gICBkZWZhdWx0czoge1xyXG4vLyAgICAgYTogMyxcclxuLy8gICAgIGI6IDIsXHJcbi8vICAgICBjOiAxLFxyXG4vLyAgIH0sXHJcbi8vIH0pXHJcbi8vIC8vIG1vZGVsLm9uKCdzZXQnLCAoZXZlbnQsIG1vZGVsKSA9PiBjb25zb2xlLmxvZyhtb2RlbC5kYikgKVxyXG4vLyAvLyBtb2RlbC5vbignc2V0OmEnLCAoZXZlbnQsIG1vZGVsKSA9PiBjb25zb2xlLmxvZyhtb2RlbC5kYikgKVxyXG4vLyAvLyBtb2RlbC5vbignc2V0OmInLCAoZXZlbnQsIG1vZGVsKSA9PiBjb25zb2xlLmxvZyhtb2RlbC5kYikgKVxyXG4vLyAvLyBtb2RlbC5vbignc2V0OmMnLCAoZXZlbnQsIG1vZGVsKSA9PiBjb25zb2xlLmxvZyhtb2RlbC5kYikgKVxyXG4vLyBtb2RlbC5zZXQoe1xyXG4vLyAgIGE6IDEsXHJcbi8vICAgYjogMixcclxuLy8gICBjOiAzLFxyXG4vLyB9KVxyXG4vLyBsZXQgdmlldyA9IG5ldyBWaWV3KClcclxuLy8gdmlldy5yZW5kZXIobW9kZWwuZ2V0KCkpXHJcbmltcG9ydCBDb250cm9sbGVyIGZyb20gJy4vbW9kdWxlLWEvY29udHJvbGxlcidcclxubGV0IGNvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlcigpXHJcbmNvbnRyb2xsZXIuc3RhcnQoKVxyXG4iXSwibmFtZXMiOlsiTW9kZWwiLCJNVkMiLCJjb25zdHJ1Y3RvciIsImFyZ3VtZW50cyIsIlZpZXciLCJlbGVtZW50TmFtZSIsImF0dHJpYnV0ZXMiLCJ1aUVsZW1lbnRzIiwidWlFbGVtZW50RXZlbnRzIiwidWlFbGVtZW50Q2FsbGJhY2tzIiwic29tZUNsYXNzQ2xpY2siLCJldmVudCIsImNvbnNvbGUiLCJsb2ciLCJpbnNlcnQiLCJlbGVtZW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwibWV0aG9kIiwidGVtcGxhdGVzIiwidGVtcGxhdGUiLCJUZW1wbGF0ZSIsInJlbmRlciIsImRhdGEiLCJ0ZW1wbGF0ZVN0cmluZyIsInBhcmVudEVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsImVycm9yIiwiaW5uZXJIVE1MIiwiYXV0b0luc2VydCIsImVtaXQiLCJuYW1lIiwiUm91dGVyIiwiaGFzaFJvdXRpbmciLCJyb290Iiwicm91dGVzIiwiY29udHJvbGxlciIsInJvdXRlIiwiQ29udHJvbGxlciIsIm1vZGVscyIsIm1vZGVsIiwiZGVmYXVsdHMiLCJhIiwiYiIsImMiLCJ2aWV3cyIsInZpZXciLCJ2aWV3RXZlbnRzIiwidmlld0NhbGxiYWNrcyIsInZpZXdSZW5kZXIiLCJyb3V0ZXJzIiwicm91dGVyIiwicm91dGVyRXZlbnRzIiwicm91dGVyQ2FsbGJhY2tzIiwicm91dGVyTmF2aWdhdGUiLCJzdGFydCIsImdldCJdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTUEsS0FBTixTQUFvQkMsR0FBRyxDQUFDRCxLQUF4QixDQUE4QjtFQUM1QkUsV0FBVyxHQUFHO1VBQ04sR0FBR0MsU0FBVDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDREosTUFBTUMsSUFBTixTQUFtQkgsR0FBRyxDQUFDRyxJQUF2QixDQUE0QjtFQUMxQkYsV0FBVyxHQUFHOzs7O01BR1ZHLFdBQUosR0FBa0I7V0FBUyxTQUFQOzs7TUFDaEJDLFVBQUosR0FBaUI7V0FBUztlQUNmO0tBRFE7OztNQUdmQyxVQUFKLEdBQWlCO1dBQVM7bUJBQ1g7S0FESTs7O01BR2ZD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
