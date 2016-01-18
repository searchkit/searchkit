require([ 'gitbook' ], function (gitbook) {
  var options, selectedValue;

  function createOptionHTML(option) {
    var isSelected = selectedValue ? selectedValue === option.value : !!option.selected;
    return '<option value="' + option.value + '"' + (isSelected ? ' selected' : '') + '>' + option.text + '</option>';
  }

  function insertVersionsSelect() {
    if (options && jQuery('.versions-select').length === 0) {
      jQuery(
        '<li class="versions-select">' +
          '<div>' +
            '<select>' +
              options.map(createOptionHTML).join('') +
            '</select>' +
          '</div>' +
        '</li>'
      ) .prependTo('.book-summary > ul.summary')
        .change(function (event) {
          var value = jQuery('option:selected', this).val();

          if (value)
            window.location.href = value;
        });
    }
  }

  gitbook.events.bind('start', function (e, config) {
    options = config.versions.options;

    if (options)
      for (var i = 0; selectedValue == null && i < options.length; ++i)
        if (options[i].selected)
          selectedValue = options[i].value;

    insertVersionsSelect();

    // Make sure we have a current book.json
    if (config.versions.gitbookConfigURL) {
      jQuery.getJSON(config.versions.gitbookConfigURL, function (bookConfig) {
        options = bookConfig.pluginsConfig.versions.options;

        // Update .versions-select with all options, preserving
        // the option that was selected in this build's config
        jQuery('.versions-select').remove();
        insertVersionsSelect();
      });
    }
  });

  gitbook.events.bind('page.change', function () {
    insertVersionsSelect();
  });
});
