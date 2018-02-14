Resume.Views.Profile = function(settings) {
  return new View(Object.assign(settings || {}, {
    name: 'profile',
    template: Resume.Templates.Profile
  }));
};
