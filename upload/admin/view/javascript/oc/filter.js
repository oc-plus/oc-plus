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
 * Example:
 *
 * ocFilter({
 *   formId    : '#form-filter',
 *   listId    : '#category',
 *   route     : 'catalog/category',
 *   userToken : '{{ user_token }}',
 * });
 */

function ocFilter(options) {
	const $form = $(options.formId);
	const $list = $(options.listId);
	const routePart = 'index.php?route=' + options.route;
	const tokenPart = '&user_token=' + options.userToken;

	const $submit = $form.find('button[type="submit"]');
	const $reset = $form.find('button[type="reset"]');

	$form.on('submit', function (e) {
		e.preventDefault();

		// We use only non-empty fields
		const filterData = {};
		let filterNotEmpty = false;

		$(this).find('input[name], select[name]').each(function () {
			const value = $(this).val();

			if (value !== '' && value !== null) {
				filterData[$(this).attr('name')] = value;
				filterNotEmpty = true;
			}
		});

		if (filterNotEmpty) {
			const urlParams = $.param(filterData);
			const query = urlParams ? '&' + urlParams : '';

			window.history.pushState({}, null, routePart + query + tokenPart);
			$list.load(routePart + '.list' + query + tokenPart);

			$submit.removeClass('btn-outline-primary').addClass('btn-primary');
			$reset.removeClass('btn-outline-secondary').addClass('btn-secondary');
		}
	});

	$form.on('reset', function () {
		$submit.removeClass('btn-primary').addClass('btn-outline-primary');
		$reset.removeClass('btn-secondary').addClass('btn-outline-secondary');

		window.location = routePart + tokenPart;
	});
}
