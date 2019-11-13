class Model extends MVC.Model {
  constructor() {
    super(...arguments);
  }

  get idAttribute() {
    return 'id';
  }

  get services() {
    return {
      get: new MVC.Service({
        type: 'GET',
        url: 'https://jsonplaceholder.typicode.com/albums'
      })
    };
  }

  get serviceEvents() {
    return {
      'get xhrResolve': 'getXHRResolve'
    };
  }

  get serviceCallbacks() {
    return {
      getXHRResolve: function getXHRResolve(event) {// 
      }
    };
  }

  start() {
    this.services.get.request();
  }

}

class Collection extends MVC.Collection {
  constructor() {
    super(...arguments);
  }

  get model() {
    return Model;
  }

  get services() {
    return {
      get: new MVC.Service({
        type: 'GET',
        url: 'https://jsonplaceholder.typicode.com/albums'
      })
    };
  }

  get serviceEvents() {
    return {
      'get xhrResolve': 'getXHRResolve'
    };
  }

  get serviceCallbacks() {
    return {
      getXHRResolve: function getXHRResolve(event) {
        var responseData = JSON.parse(event.data.response);
        this.add(responseData);
      }
    };
  }

  start() {
    this.services.get.request();
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
      'someClassClick': function someClassClick(event) {// console.log(event)
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

  get collections() {
    return {
      collection: new Collection()
    };
  }

  get collectionEvents() {
    return {
      'collection change': 'collectionChange',
      'collection addModel': 'collectionAddModel'
    };
  }

  get collectionCallbacks() {
    return {
      collectionChange: function collectionChange(event) {// console.log(event)
      },
      collectionAddModel: function collectionAddModel(event) {// console.log(event)
      }
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
      viewRender: function viewRender(event, view) {// console.log(event, view)
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
      'routerNavigate': function routerNavigate(event, router) {// console.log(event, router)
      }
    };
  }

  start() {
    this.collections.collection.start(); // this.models.model.start()
    // this.views.view.render(this.models.model.get())
    // console.log(this)
  }

}

var controller = new Controller();
controller.start();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC0xLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb3VyY2UvdGVzdC0xL21vZHVsZS1hL21vZGVsLmpzIiwiLi4vLi4vLi4vc291cmNlL3Rlc3QtMS9tb2R1bGUtYS9jb2xsZWN0aW9uLmpzIiwiLi4vLi4vLi4vc291cmNlL3Rlc3QtMS9tb2R1bGUtYS92aWV3LmpzIiwiLi4vLi4vLi4vc291cmNlL3Rlc3QtMS9tb2R1bGUtYS9yb3V0ZXIuanMiLCIuLi8uLi8uLi9zb3VyY2UvdGVzdC0xL21vZHVsZS1hL2NvbnRyb2xsZXIuanMiLCIuLi8uLi8uLi9zb3VyY2UvdGVzdC0xL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE1vZGVsIGV4dGVuZHMgTVZDLk1vZGVsIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICB9XHJcbiAgZ2V0IGlkQXR0cmlidXRlKCkgeyByZXR1cm4gJ2lkJyB9XHJcbiAgZ2V0IHNlcnZpY2VzKCkgeyByZXR1cm4ge1xyXG4gICAgZ2V0OiBuZXcgTVZDLlNlcnZpY2Uoe1xyXG4gICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgdXJsOiAnaHR0cHM6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL2FsYnVtcycsXHJcbiAgICB9KVxyXG4gIH0gfVxyXG4gIGdldCBzZXJ2aWNlRXZlbnRzKCkgeyByZXR1cm4ge1xyXG4gICAgJ2dldCB4aHJSZXNvbHZlJzogJ2dldFhIUlJlc29sdmUnLFxyXG4gIH0gfVxyXG4gIGdldCBzZXJ2aWNlQ2FsbGJhY2tzKCkgeyByZXR1cm4ge1xyXG4gICAgZ2V0WEhSUmVzb2x2ZTogZnVuY3Rpb24gZ2V0WEhSUmVzb2x2ZShldmVudCkge1xyXG4gICAgICAvLyBcclxuICAgIH0sXHJcbiAgfSB9XHJcbiAgc3RhcnQoKSB7XHJcbiAgICB0aGlzLnNlcnZpY2VzLmdldC5yZXF1ZXN0KClcclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgTW9kZWxcclxuIiwiaW1wb3J0IE1vZGVsIGZyb20gJy4vbW9kZWwnXHJcbmNsYXNzIENvbGxlY3Rpb24gZXh0ZW5kcyBNVkMuQ29sbGVjdGlvbiB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXHJcbiAgfVxyXG4gIGdldCBtb2RlbCgpIHsgcmV0dXJuIE1vZGVsIH1cclxuICBnZXQgc2VydmljZXMoKSB7IHJldHVybiB7XHJcbiAgICBnZXQ6IG5ldyBNVkMuU2VydmljZSh7XHJcbiAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICB1cmw6ICdodHRwczovL2pzb25wbGFjZWhvbGRlci50eXBpY29kZS5jb20vYWxidW1zJyxcclxuICAgIH0pXHJcbiAgfSB9XHJcbiAgZ2V0IHNlcnZpY2VFdmVudHMoKSB7IHJldHVybiB7XHJcbiAgICAnZ2V0IHhoclJlc29sdmUnOiAnZ2V0WEhSUmVzb2x2ZScsXHJcbiAgfSB9XHJcbiAgZ2V0IHNlcnZpY2VDYWxsYmFja3MoKSB7IHJldHVybiB7XHJcbiAgICBnZXRYSFJSZXNvbHZlOiBmdW5jdGlvbiBnZXRYSFJSZXNvbHZlKGV2ZW50KSB7XHJcbiAgICAgIGxldCByZXNwb25zZURhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEucmVzcG9uc2UpXHJcbiAgICAgIHRoaXMuYWRkKHJlc3BvbnNlRGF0YSlcclxuICAgIH0sXHJcbiAgfSB9XHJcbiAgc3RhcnQoKSB7XHJcbiAgICB0aGlzLnNlcnZpY2VzLmdldC5yZXF1ZXN0KClcclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQ29sbGVjdGlvblxyXG4iLCJpbXBvcnQgVGVtcGxhdGUgZnJvbSAnLi90ZW1wbGF0ZS5lanMnXHJcbmNsYXNzIFZpZXcgZXh0ZW5kcyBNVkMuVmlldyB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcigpXHJcbiAgfVxyXG4gIGdldCBlbGVtZW50TmFtZSgpIHsgcmV0dXJuICdzZWN0aW9uJyB9XHJcbiAgZ2V0IGF0dHJpYnV0ZXMoKSB7IHJldHVybiB7XHJcbiAgICAnY2xhc3MnOiAnbWVoJyxcclxuICB9IH1cclxuICBnZXQgdWlFbGVtZW50cygpIHsgcmV0dXJuIHtcclxuICAgICdzb21lQ2xhc3MnOiAnOnNjb3BlID4gLnNvbWUtY2xhc3MnLFxyXG4gIH0gfVxyXG4gIGdldCB1aUVsZW1lbnRFdmVudHMoKSB7IHJldHVybiB7XHJcbiAgICAnc29tZUNsYXNzIGNsaWNrJzogJ3NvbWVDbGFzc0NsaWNrJyxcclxuICB9IH1cclxuICBnZXQgdWlFbGVtZW50Q2FsbGJhY2tzKCkgeyByZXR1cm4ge1xyXG4gICAgJ3NvbWVDbGFzc0NsaWNrJzogZnVuY3Rpb24gc29tZUNsYXNzQ2xpY2soZXZlbnQpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coZXZlbnQpXHJcbiAgICB9LFxyXG4gIH0gfVxyXG4gIGdldCBpbnNlcnQoKSB7IHJldHVybiB7XHJcbiAgICBlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JyksXHJcbiAgICBtZXRob2Q6ICdhZnRlckJlZ2luJ1xyXG4gIH0gfVxyXG4gIGdldCB0ZW1wbGF0ZXMoKSB7IHJldHVybiB7XHJcbiAgICB0ZW1wbGF0ZTogVGVtcGxhdGVcclxuICB9IH1cclxuICByZW5kZXIoZGF0YSkge1xyXG4gICAgbGV0IHRlbXBsYXRlU3RyaW5nID0gdGhpcy50ZW1wbGF0ZXMudGVtcGxhdGUoZGF0YSlcclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudClcclxuICAgIH0gY2F0Y2goZXJyb3IpIHt9XHJcbiAgICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gdGVtcGxhdGVTdHJpbmdcclxuICAgIHRoaXMuYXV0b0luc2VydCgpXHJcbiAgICB0aGlzLmVtaXQoJ3JlbmRlcicsIHtcclxuICAgICAgbmFtZTogJ3JlbmRlcicsXHJcbiAgICAgIGRhdGE6IHt9LFxyXG4gICAgfSwgdGhpcylcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFZpZXdcclxuIiwiY2xhc3MgUm91dGVyIGV4dGVuZHMgTVZDLlJvdXRlciB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXHJcbiAgfVxyXG4gIGdldCBoYXNoUm91dGluZygpIHsgcmV0dXJuIHRydWUgfVxyXG4gIGdldCByb290KCkgeyByZXR1cm4gJy90ZXN0LTEvJyB9XHJcbiAgZ2V0IHJvdXRlcygpIHsgcmV0dXJuIHtcclxuICAgIFwiL1wiOiB7XHJcbiAgICAgIFwibmFtZVwiOiBcIi9cIixcclxuICAgICAgXCJjYWxsYmFja1wiOiBcImluZGV4XCIsXHJcbiAgICB9LFxyXG4gICAgXCIvcm91dGUtYVwiOiB7XHJcbiAgICAgIFwibmFtZVwiOiBcIi9yb3V0ZS1hXCIsXHJcbiAgICAgIFwiY2FsbGJhY2tcIjogXCJyb3V0ZS1hXCIsXHJcbiAgICB9LFxyXG4gICAgXCIvcm91dGUtYlwiOiB7XHJcbiAgICAgIFwibmFtZVwiOiBcIi9yb3V0ZS1iXCIsXHJcbiAgICAgIFwiY2FsbGJhY2tcIjogXCJyb3V0ZS1iXCIsXHJcbiAgICB9LFxyXG4gICAgXCIvcm91dGUtYi86aWQvZWRpdFwiOiB7XHJcbiAgICAgIFwibmFtZVwiOiBcIi9yb3V0ZS1iLzppZC9lZGl0XCIsXHJcbiAgICAgIFwiY2FsbGJhY2tcIjogXCJyb3V0ZS1iLWlkLWVkaXRcIixcclxuICAgIH1cclxuICB9IH1cclxuICBnZXQgY29udHJvbGxlcigpIHsgcmV0dXJuIHtcclxuICAgICdpbmRleCc6IGZ1bmN0aW9uKHJvdXRlKSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyb3V0ZScsIHJvdXRlKVxyXG4gICAgfSxcclxuICAgICdyb3V0ZS1hJzogZnVuY3Rpb24ocm91dGUpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3JvdXRlJywgcm91dGUpXHJcbiAgICB9LFxyXG4gICAgJ3JvdXRlLWInOiBmdW5jdGlvbihyb3V0ZSkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygncm91dGUnLCByb3V0ZSlcclxuICAgIH0sXHJcbiAgICAncm91dGUtYi1pZC1lZGl0JzogZnVuY3Rpb24ocm91dGUpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3JvdXRlJywgcm91dGUpXHJcbiAgICB9LFxyXG4gIH0gfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFJvdXRlclxyXG4iLCJpbXBvcnQgQ29sbGVjdGlvbiBmcm9tICcuL2NvbGxlY3Rpb24nXHJcbmltcG9ydCBWaWV3IGZyb20gJy4vdmlldydcclxuaW1wb3J0IFJvdXRlciBmcm9tICcuL3JvdXRlcidcclxuY2xhc3MgQ29udHJvbGxlciBleHRlbmRzIE1WQy5Db250cm9sbGVyIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICB9XHJcbiAgZ2V0IGNvbGxlY3Rpb25zKCkgeyByZXR1cm4ge1xyXG4gICAgY29sbGVjdGlvbjogbmV3IENvbGxlY3Rpb24oKVxyXG4gIH0gfVxyXG4gIGdldCBjb2xsZWN0aW9uRXZlbnRzKCkgeyByZXR1cm4ge1xyXG4gICAgJ2NvbGxlY3Rpb24gY2hhbmdlJzogJ2NvbGxlY3Rpb25DaGFuZ2UnLFxyXG4gICAgJ2NvbGxlY3Rpb24gYWRkTW9kZWwnOiAnY29sbGVjdGlvbkFkZE1vZGVsJyxcclxuICB9IH1cclxuICBnZXQgY29sbGVjdGlvbkNhbGxiYWNrcygpIHsgcmV0dXJuIHtcclxuICAgIGNvbGxlY3Rpb25DaGFuZ2U6IGZ1bmN0aW9uIGNvbGxlY3Rpb25DaGFuZ2UoZXZlbnQpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coZXZlbnQpXHJcbiAgICB9LFxyXG4gICAgY29sbGVjdGlvbkFkZE1vZGVsOiBmdW5jdGlvbiBjb2xsZWN0aW9uQWRkTW9kZWwoZXZlbnQpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coZXZlbnQpXHJcbiAgICB9LFxyXG4gIH0gfVxyXG4gIGdldCB2aWV3cygpIHsgcmV0dXJuIHtcclxuICAgIHZpZXc6IG5ldyBWaWV3KCksXHJcbiAgfSB9XHJcbiAgZ2V0IHZpZXdFdmVudHMoKSB7IHJldHVybiB7XHJcbiAgICAndmlldyByZW5kZXInOiAndmlld1JlbmRlcicsXHJcbiAgfSB9XHJcbiAgZ2V0IHZpZXdDYWxsYmFja3MoKSB7IHJldHVybiB7XHJcbiAgICB2aWV3UmVuZGVyOiBmdW5jdGlvbiB2aWV3UmVuZGVyKGV2ZW50LCB2aWV3KSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKGV2ZW50LCB2aWV3KVxyXG4gICAgfSxcclxuICB9IH1cclxuICBnZXQgcm91dGVycygpIHsgcmV0dXJuIHtcclxuICAgIHJvdXRlcjogbmV3IFJvdXRlcigpLFxyXG4gIH0gfVxyXG4gIGdldCByb3V0ZXJFdmVudHMoKSB7IHJldHVybiB7XHJcbiAgICAncm91dGVyIGNoYW5nZSc6ICdyb3V0ZXJOYXZpZ2F0ZScsXHJcbiAgfSB9XHJcbiAgZ2V0IHJvdXRlckNhbGxiYWNrcygpIHsgcmV0dXJuIHtcclxuICAgICdyb3V0ZXJOYXZpZ2F0ZSc6IGZ1bmN0aW9uIHJvdXRlck5hdmlnYXRlKGV2ZW50LCByb3V0ZXIpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coZXZlbnQsIHJvdXRlcilcclxuICAgIH0sXHJcbiAgfSB9XHJcbiAgc3RhcnQoKSB7XHJcbiAgICB0aGlzLmNvbGxlY3Rpb25zLmNvbGxlY3Rpb24uc3RhcnQoKVxyXG4gICAgLy8gdGhpcy5tb2RlbHMubW9kZWwuc3RhcnQoKVxyXG4gICAgLy8gdGhpcy52aWV3cy52aWV3LnJlbmRlcih0aGlzLm1vZGVscy5tb2RlbC5nZXQoKSlcclxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMpXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IENvbnRyb2xsZXJcclxuIiwiaW1wb3J0IENvbnRyb2xsZXIgZnJvbSAnLi9tb2R1bGUtYS9jb250cm9sbGVyJ1xyXG5sZXQgY29udHJvbGxlciA9IG5ldyBDb250cm9sbGVyKClcclxuY29udHJvbGxlci5zdGFydCgpXHJcbiJdLCJuYW1lcyI6WyJNb2RlbCIsIk1WQyIsImNvbnN0cnVjdG9yIiwiYXJndW1lbnRzIiwiaWRBdHRyaWJ1dGUiLCJzZXJ2aWNlcyIsImdldCIsIlNlcnZpY2UiLCJ0eXBlIiwidXJsIiwic2VydmljZUV2ZW50cyIsInNlcnZpY2VDYWxsYmFja3MiLCJnZXRYSFJSZXNvbHZlIiwiZXZlbnQiLCJzdGFydCIsInJlcXVlc3QiLCJDb2xsZWN0aW9uIiwibW9kZWwiLCJyZXNwb25zZURhdGEiLCJKU09OIiwicGFyc2UiLCJkYXRhIiwicmVzcG9uc2UiLCJhZGQiLCJWaWV3IiwiZWxlbWVudE5hbWUiLCJhdHRyaWJ1dGVzIiwidWlFbGVtZW50cyIsInVpRWxlbWVudEV2ZW50cyIsInVpRWxlbWVudENhbGxiYWNrcyIsInNvbWVDbGFzc0NsaWNrIiwiaW5zZXJ0IiwiZWxlbWVudCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIm1ldGhvZCIsInRlbXBsYXRlcyIsInRlbXBsYXRlIiwiVGVtcGxhdGUiLCJyZW5kZXIiLCJ0ZW1wbGF0ZVN0cmluZyIsInBhcmVudEVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsImVycm9yIiwiaW5uZXJIVE1MIiwiYXV0b0luc2VydCIsImVtaXQiLCJuYW1lIiwiUm91dGVyIiwiaGFzaFJvdXRpbmciLCJyb290Iiwicm91dGVzIiwiY29udHJvbGxlciIsInJvdXRlIiwiQ29udHJvbGxlciIsImNvbGxlY3Rpb25zIiwiY29sbGVjdGlvbiIsImNvbGxlY3Rpb25FdmVudHMiLCJjb2xsZWN0aW9uQ2FsbGJhY2tzIiwiY29sbGVjdGlvbkNoYW5nZSIsImNvbGxlY3Rpb25BZGRNb2RlbCIsInZpZXdzIiwidmlldyIsInZpZXdFdmVudHMiLCJ2aWV3Q2FsbGJhY2tzIiwidmlld1JlbmRlciIsInJvdXRlcnMiLCJyb3V0ZXIiLCJyb3V0ZXJFdmVudHMiLCJyb3V0ZXJDYWxsYmFja3MiLCJyb3V0ZXJOYXZpZ2F0ZSJdLCJtYXBwaW5ncyI6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
