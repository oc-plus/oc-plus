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
 *                       Also used as the target for the active-filter highlight (see below), unless
 *                       it's not a real <button>, in which case the form's [type="submit"] button is used instead.
 *
 * Behavior:
 *   On submit  — adds 'btn-primary' to the filter button (visual cue that a filter is active).
 *   On reset   — removes 'btn-primary' from the filter button.
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
	const $button = options.buttonId ? $(options.buttonId) : $form.find('button[type="submit"]');

	if (options.buttonId) {
		$(options.buttonId).on('click', function () {
			$form.trigger('submit');
		});
	}

	$form.on('submit', function (e) {
		e.preventDefault();

		// We use only non-empty fields
		var filterData = {};
		var filterNotEmpty = false;
		$(this).find('input[name], select[name]').each(function () {
			var value = $(this).val();
			if (value !== '' && value !== null) {
				filterData[$(this).attr('name')] = value;
				filterNotEmpty = true;
			}
		});

		if (filterNotEmpty) {
			var urlParams = $.param(filterData);
			var query = urlParams ? '&' + urlParams : '';

			window.history.pushState({}, null, routePart + query + tokenPart);
			$list.load(routePart + '.list' + query + tokenPart);

			$button.removeClass('btn-light').addClass('btn-warning');
		}
	});

	$form.on('reset', function () {
		$button.removeClass('btn-warnong').addClass('btn-light');

		window.location = routePart + tokenPart;
	});
}
