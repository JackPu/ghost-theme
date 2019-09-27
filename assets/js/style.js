function addStyleString(str) {
  var node = document.createElement('style');
  node.innerHTML = str;
  document.head.appendChild(node);
}
function generateColorCss() {
  var cssStr = '';
  for (var i = 0; i < 10; i++) {
      var r = parseInt(255 * Math.random());
      var g = parseInt(255 * Math.random());
      var b = parseInt(255 * Math.random());
      var color = 'rgb(' + [r, g ,b].join(',') + ')';
      cssStr += '#content article:nth-child(10n + ' + (i+1) + ') .cover {background-color:' + color + '}';
      r = 50 + parseInt(100 * Math.random());
      g = 30 + parseInt(50 * Math.random());
      b = 120 +parseInt(135 * Math.random());
      color = 'rgb(' + [r, g ,b].join(',') + ')';
      cssStr += '#slideshow .slide:nth-child(10n + ' + (i+1) + ') {background-color:' + color + '}';
  }
  addStyleString(cssStr);
}
generateColorCss();