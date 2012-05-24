/**
 * looplang.org: by Dhanji R. Prasanna (dhanji at gmail)
 */

var OPERATORS = ['->', '<-', '=>', 'and', 'or', 'not', 'class', 'if', 'then', 'else',
  'where', 'for', 'in', '==', '>=', '<=', 'true', 'false', 'except', 'immutable', 'require',
  'module', 'as'];

(function() {
  var ops = OPERATORS;
  OPERATORS = {};
  for (var k = 0; k < ops.length; k++) {
    OPERATORS[ops[k]] = true;
  }
})();

ESC = 27;
LEFT = 37;
RIGHT = 39;

function escape(token) {
  return $('<div/>').text(token).html();
}

$(function() {
  // First hide all the examples, to put them into our slideshow.
  $('div.code ol > li').css('display', 'none');

  $('div.code pre').each(function() {
    var code = $(this).text();

    var html = [];
    // Process into code markup...
    var tokens = code.split(/([., \r\n\(\){}\[\]]+)/);

    var inString = false, inBold = false, inError = false, inComment = false;
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      var trimmedToken = $.trim(token);
      if (trimmedToken == '') {
        // Special case for handling single-line comments
        if (!inString && token.match(/.*[\n\r].*/)) {
          inComment = false;
          token = '</span>' + token;
        }
        html.push(token);
        continue;
      }

      if (!inComment && token.match(/^[\\~"'`]/) && !inBold && !inError) {
        inString = true;
        inBold = token.match(/^[~]/);
        inError = token.match(/^[\\]/);
        token = token.replace(/^[\\~]/, '');
        if (inBold) {
          token = '<span class="highlight">' + token;
          if (token.replace(/[\r\n]/, '').match(/[~]$/)) {
           token = token.replace(/[~]$/, '') + '</span>';
            inString = false;
            inBold = false;
          }
        } else if (inError) {
          token = '<span class="error">' + token;
          if (trimmedToken != '' && token.match(/[\\]$/)) {
            token = token.replace(/[\\]$/, '') + '</span>';
            inString = false;
            inError = false;
          }
        } else {
          token = '<span class="string">' + token;
        }
      }

      if (!inComment && token.match(/["'`~\\]$/)) {
        inString = false;
        inBold = false;
        inError = false;
        token = token.replace(/[~\\]$/, '');
        token += '</span>';
      } else if (!inString && trimmedToken == '#') {
        inComment = true;
        token = '<span class="comment">' + token;
      } else if (!inString && token.match(/.*[\n\r].*/)) {
        inComment = false;
        token = '</span>' + token;
      } else if (!inString) {
        // highlight the rest...
        if (OPERATORS[trimmedToken])
          token = '<span class="operator">' + escape(token) + '</span>';
        else if (trimmedToken.charAt(0).match(/[A-Z]/))
          token = '<span class="typeLiteral">' + escape(token) + '</span>';
        else if (trimmedToken.match(/[0-9]+/))
          token = '<span class="numeric">' + escape(token) + '</span>';
        else if (trimmedToken.charAt(0) == '@')
          token = '<span class="symbol">' + escape(token) + '</span>';
      }

      html.push(token);
    }

    html = html.join('');

    $(this).html(html);
  });

  var spin = function(forward) {
    var target = $('#scriptTitle');
    var parent = target.parent();
    var visibleLi = parent.find('ol > li.on');
    var next = forward ? visibleLi.next() : visibleLi.prev();

    // Loop back to the first.
    if (!next.length) {
      var list = parent.find('ol > li');
      next = forward ? list.first() : list.last();
    }

    visibleLi.removeClass('on');
    next.addClass('on');

    // Update the text in our link.
    target.find('span').html(next.attr('title'));
    parent[0].style['webkitTransitionDuration'] = '500';

    return false;
  };

  // Setup spinner.
  $('#scriptTitle').click(function() {
    spin(true);
  });

  // Arrow keys to move backwards.
  $(document).keydown(function(event) {
    if (event.which == LEFT || event.which == RIGHT)
      spin(event.which == RIGHT);
  });

  // Hide the training wheels.
  var pointer = $('#pointer');
  pointer.animate({
    rotate: '15deg',
    translateY: '12px',
    scale: 1.2
  }, 0);
  pointer.animate({
    opacity: 1
  }, 150, function() {
    pointer.animate({
      opacity: 0
    }, 300, function() {
      pointer.animate({
        opacity: 1
      }, 150, function() {
        setTimeout(function() {
          pointer.animate({
            opacity: 0
          }, 200, function() {
            pointer.remove();
          });
        }, 700);
      });
    })
  });
});
