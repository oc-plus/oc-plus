/**
 * Universal Autocomplete Helper
 *
 * Usage:
 *
 * ocAutocomplete(options)
 *
 * Required options:
 *   inputSelector  {string}   jQuery text field selector
 *   route          {string}   Autocomplete route (e.g. 'catalog/category.autocomplete')
 *   userToken      {string}   user_token for current session
 *   valueKey       {string}   The "value" key in the JSON response (e.g. 'category_id')
 *   labelKey       {string}   "label" key in JSON response (e.g. 'name')
 *   onSelect       {function(item)}  Called when an item is selected.
 *                              item = { value, label }
 *
 * Optional options:
 *   prependNone    {boolean|string}
 *                  false  — do not add an empty item (default)
 *                  true   — add { value: '0', label: '' }
 *                  string — add { value: '0', label: <this string> }
 *
 * Example — field with parent category (with the item "None"):
 *
 * ocAutocomplete({
 *     inputSelector : '#input-parent',
 *     route         : 'catalog/category.autocomplete',
 *     userToken     : '{{ user_token }}',
 *     valueKey      : 'category_id',
 *     labelKey      : 'name',
 *     prependNone   : '{{ text_none }}',
 *     onSelect      : function(item) {
 *       $('#input-parent').val(decodeHTMLEntities(item.label));
 *       $('#input-parent-id').val(item.value);
 *     }
 *   });
 *
 * Example — filter field (without prependNone, adds a row to the table):
 *
 * ocAutocomplete({
 *     inputSelector : '#input-filter',
 *     route         : 'catalog/filter.autocomplete',
 *     userToken     : '{{ user_token }}',
 *     valueKey      : 'filter_id',
 *     labelKey      : 'name',
 *     onSelect      : function(item) {
 *       $('#input-filter').val('');
 *       $('#row-filter-' + item.value).remove();
 *       var html  = '<tr id="row-filter-' + item.value + '">';
 *           html += '  <td>' + item.label + '<input type="hidden" name="category_filter[]" value="' + item.value + '"/></td>';
 *           html += '  <td class="text-end"><button type="button" class="btn btn-danger btn-sm"><i class="fa-solid fa-minus-circle"></i></button></td>';
 *           html += '</tr>';
 *       $('#category-filter tbody').append(html);
 *     }
 *   });
 */

function ocAutocomplete(options) {
    const inputSelector = options.inputSelector;
    const url = 'index.php?route=' + options.route + '&user_token=' + options.userToken;
    const valueKey = options.valueKey;
    const labelKey = options.labelKey;
    const prependNone = (options.prependNone !== undefined) ? options.prependNone : false;
    const onSelect = options.onSelect;

    $(inputSelector).autocomplete({
        'source': function (request, response) {
            $.ajax({
                url: url + '&filter_name=' + encodeURIComponent(request),
                dataType: 'json',
                success: function (json) {
                    if (prependNone !== false) {
                        let noneLabel = (typeof prependNone === 'string') ? prependNone : '';
                        let noneItem = {};
                        noneItem[valueKey] = '0';
                        noneItem[labelKey] = noneLabel;
                        json.unshift(noneItem);
                    }

                    response($.map(json, function (item) {
                        return {
                            value: item[valueKey],
                            label: item[labelKey]
                        };
                    }));
                }
            });
        },

        'select': function (item) {
            if (typeof onSelect === 'function') {
                onSelect(item);
            }
        }
    });
}
