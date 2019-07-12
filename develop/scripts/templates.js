this["MVC"] = this["MVC"] || {};
this["MVC"]["Templates"] = this["MVC"]["Templates"] || {};
this["MVC"]["Templates"]["\"NoReallyThatsSomeTemplate\""] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"\">\r\n  <span>HEH</span>\r\n</div>\r\n";
},"useData":true});
this["MVC"]["Templates"]["\"ThatsSomeTemplate\""] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"\">\r\n  <span>MEH</span>\r\n</div>\r\n";
},"useData":true});
Handlebars.registerPartial("NoReallyThatsSomeTemplate", Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"\">\r\n  <span>HEH</span>\r\n</div>\r\n";
},"useData":true}))
Handlebars.registerPartial("ThatsSomeTemplate", Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"\">\r\n  <span>MEH</span>\r\n</div>\r\n";
},"useData":true}))