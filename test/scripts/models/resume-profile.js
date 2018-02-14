Resume.Models.Profile = function(settings) {
  return new Model({
    name: 'profile',
    data: {
      'first-name': '',
      'last-name': '',
      'title': '',
      'links': [
        {
          'name': '',
          'link': '',
        }
      ],
      'summary': [
        {
          'type': '',
          'label': '',
          'content': '',
        }
      ],
    },
  });
};
