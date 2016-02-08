require([
  'gitbook'
], function (gitbook) {
  gitbook.events.bind('page.change', function () {
    mermaid.init();
  });
});