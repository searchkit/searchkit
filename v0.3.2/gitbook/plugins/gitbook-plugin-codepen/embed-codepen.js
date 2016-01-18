require(["gitbook", "jQuery"], function(gitbook, $) {

  var root = (document.getElementsByTagName('head')[0] ||
    document.getElementsByTagName('body')[0]);

  var initEmbed = function() {
    window.__cp_embed_script_ran = false;
    window.CodePenEmbed.init();
  };

  var loadEmbedScript = function() {
    var script = document.createElement('script');
    script.onload = initEmbed;
    script.type = 'text/javascript';
    script.async = true;
    script.charset = 'UTF-8';
    script.src = document.location.protocol +
      '//assets.codepen.io/assets/embed/ei.js';
    root.appendChild(script);
  };

  gitbook.events.bind("page.change", function(e) {
    if (!window.CodePenEmbed) loadEmbedScript();
    else {
      window.__cp_embed_script_ran = false;
      window.CodePenEmbed.init();
    }
  });
});
