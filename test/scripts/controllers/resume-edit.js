Resume.Controllers.Edit = function(settings) {
  return new Controller(Object.assign(settings || {}, {
    models: {
      profile: Resume.Models.Profile(),
      experience: Resume.Models.Experience(),
      education: Resume.Models.Education(),
    },
    views: {
      main: new View({
        name: 'resume-edit',
        attributes: {
          'data-view-id': 'resume-edit'
        },
      }),
      profile: new View({
        name: 'profile',
        attributes: {
          'data-view-id': 'profile',
        },
        template: Resume.Templates.Profile,
        uiElements: {
          'first-name': '[data-id="first-name"]',
          'last-name': '[data-id="last-name"]',
          'title': '[data-id="title"]',
          'links': '[data-id="links"]',
          'summary': '[data-id="summary"]',
        },
        uiEvents: {
          '@profile,@first-name,@last-name,@title,@links,@summary input,change': 'onUIEvent',
        },
        onUIEvent: function(event) {
          console.log('event',event);
        },
      }),
      experience: new View({
        name: 'experience',
        template: Resume.Templates.Experience,
        uiElements: {
          'experience': '[data-id="experience"]',
          'experience-label': '[data-id="experience-label"]',
          'experience-employer': '[data-id="experience-employer"]',
          'experience-title': '[data-id="experience-title"]',
          'experience-start': '[data-id="experience-start"]',
          'experience-stop': '[data-id="experience-stop"]',
        },
        uiEvents: {
          '@experience,@experience-label,@experience-employer,@experience-title,@experience-start,@experience-stop input,change': 'onUIEvent'
        },
        onUIEvent: function(event) {
          console.log('event', event);
        },
      }),
      education: new View({
        name: 'education',
        template: Resume.Templates.Education,
        uiElements: {
          'education': '[data-id="education"]',
          'education-institution': '[data-id="education-institution"]',
          'education-degree': '[data-id="education-degree"]',
          'education-graduation-year': '[data-id="education-graduation-year"]',
        },
        uiEvents: {
          '@education,@education-institution,@education-degree,@education-graduation-year input,change': 'onUIEvent',
        },
      }),
    },
    viewEvents: {
      '@profile,@experience,@education ui:event': function() {},
    },
    modelEvents: {
      // @profile change:property onProfileChangeProperty
    },
    // onProfileUIEventType function
    // onProfileChangeProperty function
    initialize: function() {
      console.log('initialize');
    },
    onUIEvent: function(event) {
      console.log('onUIEvent', event);
    },
  }));
};
