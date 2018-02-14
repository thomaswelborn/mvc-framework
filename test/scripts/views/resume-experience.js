Resume.Views.Experience = function(settings) {
  return new View(Object.assign(settings || {}, {
    name: 'experience',
    template: Resume.Templates.Experience,
  }));
};
