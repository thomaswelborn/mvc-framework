Resume.Views.Education = function(settings) {
  return new View(Object.assign(settings || {}, {
    name: 'education',
    template: Resume.Templates.Education,
  }));
};
