Resume.Controllers.Edit = function(settings) {
  return new Controller(Object.assign(settings || {}, {
    models: {
      profile: Resume.Models.Profile(),
      experience: Resume.Models.Experience(),
      education: Resume.Models.Education(),
    },
    views: {
      main: new View(),
      profile: Resume.Views.Profile(),
      experience: Resume.Views.Experience(),
      education: Resume.Views.Education(),
    },
    viewEvents: {
      // @profile ui:event:type onProfileUIEventType
    },
    modelEvents: {
      // @profile change:property onProfileChangeProperty
    },
    // onProfileUIEventType function
    // onProfileChangeProperty function
    initialize: function() {},
  }));
};
