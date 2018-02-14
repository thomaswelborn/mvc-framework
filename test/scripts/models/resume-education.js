Resume.Models.Education = function(settings) {
  return new Model({
    name: 'education',
    data: {
      'label': '',
      'history': [
        {
          'institution': '',
          'degree': '',
          'graduation-year': '',
        }
      ]
    },
  });
};
