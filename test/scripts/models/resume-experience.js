Resume.Models.Experience = function(settings) {
  return new Model({
    name: 'experience',
    data: {
      'label': '',
      'keyword-groups': [
        {
          'employer': '',
          'title': '',
          'start': '',
          'stop': '',
          'description': '',
          'keyword-groups': [
            {
              'label': '',
              'keywords': '',
            }
          ],
        }
      ],
    },
  });
};
