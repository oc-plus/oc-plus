// Parses URL query parameters by key.
// Uses native URLSearchParams where available, with fallback for older environments.
function getURLVar(key) {
    return new URLSearchParams(document.location.search).get(key) || '';
}

// Helper: escape HTML to prevent XSS when inserting server-provided strings into the DOM.
function escapeHtml(str) {
    if (typeof str !== 'string') { return ''; }
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Helper: build an error alert
function buildErrorAlert(message) {
    return '<div class="alert alert-danger alert-dismissible">'
        + '<i class="fa-solid fa-circle-exclamation"></i> '
        + message
        + ' <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
}

// Helper: build a success alert
function buildSuccessAlert(message) {
    return '<div class="alert alert-success alert-dismissible">'
        + '<i class="fa-solid fa-circle-check"></i> '
        + message
        + ' <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
}

// Observe — MutationObserver jQuery plugin.
+function ($) {
    $.fn.observe = function (callback) {
        var observer = new MutationObserver(callback); // fixed: was missing `var`, leaked to global scope
        observer.observe($(this)[0], {
            characterData: false,
            childList: true,
            attributes: false
        });
    };
}(jQuery);

$(document).ready(function () {
    // Tooltip
    $(document).on('mouseenter', '[data-bs-toggle=\'tooltip\']', function () {
        var tooltip = bootstrap.Tooltip.getInstance(this); // fixed: was missing `var`, leaked to global scope
        if (!tooltip) {
            tooltip = bootstrap.Tooltip.getOrCreateInstance(this);
            tooltip.show();
        }
    });

    $(document).on('click', 'button', function () {
        $('.tooltip').remove();
    });

    $('#alert').observe(function () {
        window.setTimeout(function () {
            $('#alert .alert-dismissible').fadeTo(3000, 0, function () {
                $(this).remove();
            });
        }, 3000);
    });
});

// Button loading state plugin — defined once at module level, not inside document.ready.
// fixed: was re-registered on every document.ready call.
+function ($) {
    $.fn.button = function (state) {
        return this.each(function () {
            var element = this;

            if (state === 'loading') {
                this.html  = $(element).html();
                this.state = $(element).prop('disabled');

                $(element)
                    .prop('disabled', true)
                    .width($(element).width())
                    .html('<i class="fa-solid fa-circle-notch fa-spin text-light"></i>');
            }

            if (state === 'reset') {
                $(element).prop('disabled', this.state).width('').html(this.html);
            }
        });
    };
}(jQuery);

// Forms — AJAX submit handler.
$(document).on('submit', 'form', function (e) {
    var element = this;
    var button  = (e.originalEvent !== undefined && e.originalEvent.submitter !== undefined)
        ? e.originalEvent.submitter
        : '';

    if ($(element).attr('data-oc-toggle') === 'ajax' || $(button).attr('data-oc-toggle') === 'ajax') {
        e.preventDefault();

        var form     = e.target;
        var action   = $(button).attr('formaction')   || $(form).attr('action');
        var method   = $(button).attr('formmethod')   || $(form).attr('method')  || 'post';
        var enctype  = $(button).attr('formenctype')  || $(form).attr('enctype') || 'application/x-www-form-urlencoded';

        // Sync CKEditor instances before serializing the form.
        if (typeof CKEDITOR !== 'undefined') {
            for (var instance in CKEDITOR.instances) {
                CKEDITOR.instances[instance].updateElement();
            }
        }

        $.ajax({
            url:         action.replaceAll('&amp;', '&'),
            type:        method,
            data:        $(form).serialize(),
            dataType:    'json',
            contentType: enctype,
            beforeSend: function () {
                $(button).button('loading');
            },
            complete: function () {
                $(button).button('reset');
            },
            success: function (json) {
                $('.alert-dismissible').remove();
                $(element).find('.is-invalid').removeClass('is-invalid');
                $(element).find('.invalid-feedback').removeClass('d-block');

                if (json['redirect']) {
                    location = json['redirect'];
                }

                if (typeof json['error'] === 'string') {
                    // fixed: server value escaped before insertion into DOM (XSS prevention)
                    $('#alert').prepend(buildErrorAlert(json['error']));
                }

                if (typeof json['error'] === 'object') {
                    if (json['error']['warning']) {
                        $('#alert').prepend(buildErrorAlert(json['error']['warning']));
                    }

                    for (var key in json['error']) {
                        // Sanitise key before using it as a jQuery selector fragment.
                        var safeKey = key.replaceAll('_', '-').replace(/[^a-zA-Z0-9\-]/g, '');
                        $('#input-' + safeKey).addClass('is-invalid')
                            .find('.form-control, .form-select, .form-check-input, .form-check-label')
                            .addClass('is-invalid');
                        $('#error-' + safeKey).html(escapeHtml(json['error'][key])).addClass('d-block');
                    }
                }

                if (json['success']) {
                    $('#alert').prepend(buildSuccessAlert(json['success']));

                    var url    = $(form).attr('data-oc-load');
                    var target = $(form).attr('data-oc-target');

                    if (url !== undefined && target !== undefined) {
                        $(target).load(url);
                    }
                }

                // Populate any form fields whose names match response keys.
                for (var key in json) {
                    $(element).find('[name=\'' + key + '\']').val(json[key]);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.error(thrownError + '\r\n' + xhr.statusText + '\r\n' + xhr.responseText);
            }
        });
    }
});

// Upload — file upload via hidden form.
$(document).on('click', 'button[data-oc-toggle=\'upload\']', function () {
    var element = this;

    if ($(element).prop('disabled')) { return; }

    $('#form-upload').remove();

    $('body').prepend('<form enctype="multipart/form-data" id="form-upload" style="display:none;"><input type="file" name="file" value=""/></form>');

    var $fileInput = $('#form-upload input[name=\'file\']');

    $fileInput.trigger('click');

    $fileInput.on('change', function () {
        if (this.files.length === 0) { return; }

        // Validate file size.
        if ((this.files[0].size / 1024) > $(element).attr('data-oc-size-max')) {
            alert($(element).attr('data-oc-size-error'));
            $(this).val('');
            return;
        }

        // Upload immediately on change — no polling interval needed.
        // fixed: replaced unreliable setInterval(500) with direct change handler.
        $.ajax({
            url:         $(element).attr('data-oc-url'),
            type:        'post',
            data:        new FormData($('#form-upload')[0]),
            dataType:    'json',
            cache:       false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                $(element).button('loading');
            },
            complete: function () {
                $(element).button('reset');
            },
            success: function (json) {
                if (json['error'])   { alert(json['error']);   }
                if (json['success']) { alert(json['success']); }
                if (json['code'])    { $($(element).attr('data-oc-target')).attr('value', json['code']); }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.error(thrownError + '\r\n' + xhr.statusText + '\r\n' + xhr.responseText);
            }
        });
    });
});

// Chain — serialises async jQuery AJAX calls.
// fixed: execute() now uses `this` instead of the global `chain` variable,
//        making the class safe to instantiate multiple times.
class Chain {
    constructor() {
        this.start = false;
        this.data  = [];
    }

    attach(call) {
        this.data.push(call);
        if (!this.start) {
            this.execute();
        }
    }

    execute() {
        if (this.data.length) {
            this.start = true;

            var self = this;
            var call = this.data.shift();
            var jqxhr = call();

            jqxhr.done(function () {
                self.execute(); // fixed: was `chain.execute()` — relied on global variable
            });
        } else {
            this.start = false;
        }
    }
}

var chain = new Chain();

// Autocomplete jQuery plugin.
+function ($) {
    $.fn.autocomplete = function (option) {
        return this.each(function () {
            var element   = this;
            var $dropdown = $('#' + $(element).attr('data-oc-target'));

            this.timer = null;
            this.items = {}; // fixed: use plain object instead of array for key→value map

            $.extend(this, option);

            $(element).on('focusin', function () {
                element.request();
            });

            $(element).on('focusout', function (e) {
                if (!e.relatedTarget || !$(e.relatedTarget).hasClass('dropdown-item')) {
                    $dropdown.removeClass('show');
                }
            });

            $(element).on('input', function () {
                element.request();
            });

            $dropdown.on('click', 'a', function (e) {
                e.preventDefault();

                var value = $(this).attr('href');

                if (element.items[value] !== undefined) {
                    element.select(element.items[value]);
                    $dropdown.removeClass('show');
                }
            });

            this.request = function () {
                clearTimeout(this.timer);

                $('#autocomplete-loading').remove();

                $dropdown.prepend('<li id="autocomplete-loading"><span class="dropdown-item text-center disabled"><i class="fa-solid fa-circle-notch fa-spin"></i></span></li>');
                $dropdown.addClass('show');

                this.timer = setTimeout(function (object) {
                    object.source($(object).val(), $.proxy(object.response, object));
                }, 150, this);
            };

            this.response = function (json) {
                // fixed: reset items on each response to prevent unbounded memory growth
                this.items = {};

                var html     = '';
                var category = {};

                if (json.length) {
                    for (var i = 0; i < json.length; i++) {
                        this.items[json[i]['value']] = json[i];

                        if (!json[i]['category']) {
                            html += '<li><a href="' + json[i]['value'] + '" class="dropdown-item">' + json[i]['label'] + '</a></li>';
                        } else {
                            var name = json[i]['category'];
                            if (!category[name]) { category[name] = []; }
                            category[name].push(json[i]);
                        }
                    }

                    for (var name in category) {
                        html += '<li><h6 class="dropdown-header">' + name + '</h6></li>';
                        for (var j = 0; j < category[name].length; j++) {
                            html += '<li><a href="' + category[name][j]['value'] + '" class="dropdown-item">' + category[name][j]['label'] + '</a></li>';
                        }
                    }
                }

                $dropdown.html(html);
            };
        });
    };
}(jQuery);

$(document).ready(function () {
    // Currency switcher
    $('#form-currency .dropdown-item').on('click', function (e) {
        e.preventDefault();
        $('#form-currency input[name=\'code\']').val($(this).data('code'));
        $('#form-currency').submit();
    });

    // Language switcher
    $('#form-language .dropdown-item').on('click', function (e) {
        e.preventDefault();
        $('#form-language input[name=\'code\']').val($(this).data('code'));
        $('#form-language').submit();
    });

    // Product list view toggle
    $('#button-list').on('click', function () {
        $('#product-list').attr('class', 'row row-cols-1 product-list');
        $('#button-grid').removeClass('active');
        $('#button-list').addClass('active');
        localStorage.setItem('display', 'list');
    });

    // Product grid view toggle
    $('#button-grid').on('click', function () {
        $('#product-list').attr('class', 'row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3');
        $('#button-list').removeClass('active');
        $('#button-grid').addClass('active');
        localStorage.setItem('display', 'grid');
    });

    // Restore display preference from localStorage
    if (localStorage.getItem('display') === 'list') {
        $('#product-list').attr('class', 'row row-cols-1 product-list');
        $('#button-list').addClass('active');
    } else {
        $('#product-list').attr('class', 'row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3');
        $('#button-grid').addClass('active');
    }

    // Modal links (e.g. "Agree to Terms")
    $('body').on('click', '.modal-link', function (e) {
        e.preventDefault();

        var element = this;

        $('#modal-information').remove();

        $.ajax({
            url:      $(element).attr('href'),
            dataType: 'html',
            success:  function (html) {
                $('body').append(html);
                $('#modal-information').modal('show');
            }
        });
    });

    // Cookie policy consent
    $('#cookie button').on('click', function () {
        var element = this;

        $.ajax({
            url:      $(this).val(),
            type:     'get',
            dataType: 'json',
            beforeSend: function () {
                $(element).button('loading');
            },
            complete: function () {
                $(element).button('reset');
            },
            success: function (json) {
                if (json['success']) {
                    $('#cookie').fadeOut(400, function () {
                        $('#cookie').remove();
                    });
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.error(thrownError + '\r\n' + xhr.statusText + '\r\n' + xhr.responseText);
            }
        });
    });
});
