/**
 * looplang.org: by Dhanji R. Prasanna (dhanji at gmail)
 */
$(function() {
  $('div.code > pre').each(function() {
    var code = $(this).text();

    var html = [];
    // Process into code markup...


    html = html.join('');
    $(this).html(code);
  });
});
