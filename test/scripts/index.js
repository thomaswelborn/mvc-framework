document.addEventListener('DOMContentLoaded', function(event) {
  new AutoSuggest.Controllers.AutoSuggest({
    $parentElement: document.querySelector('#application'),
  });
});
