;
/* various plugins */
$.fn.flash = function() {
    return this.each(function() {
        var $this = $(this),
                opacity = $this.css('opacity');

        $this.css('opacity', 0.3).animate({opacity: opacity});
    });
};

$.fn.autogrow = function() {
    return this.not('.hasAutogrow').addClass('hasAutogrow').each(function() {
        var $this = $(this);
        $this.on('keyup', function() {
            $this.height($this.prop('scrollHeight'));
        }).trigger('keyup');
    });
};


/* onReady */
(function($) {
    var onReady = window.onReady || [];
    for (var i=0, l=onReady.length; i<l; i++) onReady[i].apply(null, [$]);
})(jQuery);


/* init forms */
(function($) {
    var initForms = function(elem) {
        if ($.fn.chosen)
            $('select', elem || document).chosen();
        if ($.fn.datepicker)
            $('.datepicker', elem || document).datepicker();

        $('textarea.autogrow', elem || document).autogrow();
    };

    initForms();

    /* inject function into the global namespace */
    if (!window.initForms) window.initForms = initForms;
})(jQuery);


/* modals and ajaxmodal */
(function($) {
    var initModal = function() {
        var modal = this,
            $elem = $(this);

        if ($elem.outerHeight() > 500) {
            $elem.css('marginTop', -Math.min(
                $(window).height() / 2,
                $elem.outerHeight() / 2));
        } else {
            $elem.css('marginTop', '-250px');
        }

        $elem.find('form').each(function() {
            var $form = $(this);
            $form.on('submit', function() {
                // TODO detect enctype=multipart/form-data and use
                // ajaxSubmit (from jquery.form.js) instead. Additionally,
                // progress code from keetab_cp.
                $.post(this.action, $form.serialize(), function(data) {
                    if (typeof(data) == 'string') {
                        $elem.html(data);
                        initModal.call($elem.get(0));
                    } else {
                        $.each(data, function(key, value) {
                            $('#' + key).html(value);
                            $elem.modal('hide');
                        });
                    }
                });
                return false;
            });
        });
        setTimeout(function() {
            $elem.find('form').find('input:visible, textarea').first().focus();
            initForms();
        }, 100);
    },
    modalLoad = function(url) {
        var modal = $('#ajax-modal');

        if (!modal.length) {
            /* create div for holding AJAX-loaded modals, once */
            modal = $('<div id="ajax-modal" class="modal fade" />');
            modal.appendTo('body');
            modal.on('hide', function() {
                $('#logo').focus().blur();
            });
        }

        modal.empty().load(url, function() {
            initModal.call(this);
        }).modal();
    };


    $('body').on('click', 'a[data-toggle=ajaxmodal]', function(e) {
        modalLoad(this.href);
        return false;
    });

    /* inject function into the global namespace */
    if (!window.modalLoad) window.modalLoad = modalLoad;
})(jQuery);


/* jQuery / Django CSRF handling
Thanks, https://docs.djangoproject.com/en/dev/ref/contrib/csrf/#ajax */
jQuery(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});
