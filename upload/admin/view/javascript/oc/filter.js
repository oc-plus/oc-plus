/**
 * Universal Filter Handler
 *
 * Usage:
 *
 * ocFilter(options)
 *
 * Required options:
 *   formId    {string}  jQuery filter form selector      (e.g. '#form-filter')
 *   listId    {string}  jQuery list container selector   (e.g. '#list')
 *   route     {string}  Controller route                 (e.g. 'catalog/category')
 *   userToken {string}  user_token for current session   (e.g. '{{ user_token }}')
 *
 * Optional options:
 *   buttonId  {string}  jQuery Filter button selector; if not submitted, the form listens only to the submit event.
 *                       Useful if there are several buttons or when submitting by Enter. (e.g. '#button-filter')
 *
 * Example:
 *
 * ocFilter({
 *   formId    : '#form-filter',
 *   listId    : '#category',
 *   route     : 'catalog/category',
 *   userToken : '{{ user_token }}',
 *   buttonId  : '#button-filter'
 * });
 */

function ocFilter(options) {
  const $form = $(options.formId);
  const $list = $(options.listId);
  const routePart = 'index.php?route=' + options.route;
  const tokenPart = '&user_token=' + options.userToken;

  if (options.buttonId) {
    $(options.buttonId).on('click', function () {
      $form.trigger('submit');
    });
  }

  $form.on('submit', function (e) {
    e.preventDefault();

    // We use only non-empty fields
    var filterData = {};
    $(this).find('input[name], select[name]').each(function () {
      var value = $(this).val();
      if (value !== '' && value !== null) {
        filterData[$(this).attr('name')] = value;
      }
    });

    var urlParams = $.param(filterData);
    var query = urlParams ? '&' + urlParams : '';

    window.history.pushState({}, null, routePart + query + tokenPart);
    $list.load(routePart + '.list' + query + tokenPart);
  });

  $form.on('reset', function () {
    window.location = routePart + tokenPart;
  });
}
