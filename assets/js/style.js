function addStyleString(str) {
  var node = document.createElement('style');
  node.innerHTML = str;
  document.head.appendChild(node);
}
function generateColorCss() {
  var cssStr;
  for (var i = 0; i < 10; i++) {
    var r = parseInt(255 * Math.random());
    var g = parseInt(255 * Math.random());
    var b = parseInt(255 * Math.random());
    var color = 'rgb(' + [r, g ,b].join(',') + ')';
    cssStr += '#content article:nth-child(10n + ' + (i+1) + ') {background-color:' + color + '}';
  }
  addStyleString(cssStr);
}
