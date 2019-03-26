// escape HTML strings
function escapeHtml(str) {
  // unescape the string
  // we do this because our frontend application automatically escapes our inputs.
  const unescaped = str.split('&amp').join('&')
    .split('&lt').join('<')
    .split('&gt')
    .join('>')
    .split('&quot')
    .join('"')
    .split('&#39')
    .join("'");

  // escape the unescaped string
  return unescaped.split('&').join('&amp')
    .split('<').join('&lt')
    .split('>')
    .join('&gt')
    .split('"')
    .join('&quot')
    .split("'")
    .join('&#39');
}

module.exports = escapeHtml;
