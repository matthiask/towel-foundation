;
/* main initialization routine */
$.fn.towelFoundation = function() {
    /* onReady */
    $(function() {
        var onReady = window.onReady || [];
        for (var i=0, l=onReady.length; i<l; i++) onReady[i].apply(null, [$]);
    });

    return this;
};

/* various plugins */
$.fn.flash = function() {
    return this.each(function() {
        var $this = $(this),
            opacity = $this.css('opacity');

        $this.css('opacity', 0.3).animate({opacity: opacity});
    });
};

$.fn.autogrow = function() {
    return this.not('.hasAutogrow').addClass('hasAutogrow').elastic();
};

/* gettext dummy
* if you need internationalizations, read here how to activate:
* https://docs.djangoproject.com/en/dev/topics/i18n/translation/#internationalization-in-javascript-code
* */
if (window.gettext === undefined) {
    window.gettext = function(msgid) {
        return msgid
    }
}

/* init forms */
(function($) {
    if (!window.onForm) window.onForm = [];

    var onForm = window.onForm,
        initForms = function(elem) {
            var elem = $(elem || document);
            for (var i=0, len=onForm.length; i<len; ++i)
                onForm[i].apply(null, [elem, $]);
        };

    onForm.push(function(elem, $) {
        if ($.fn.chosen)
            elem.find('select').not('.plain').chosen();
        if ($.fn.datePicker) {
            elem.find('.type-date').each(function() {
                var self = $(this),
                    input = self.find('input[type=text]');

                Date.format = self.data('date-format');
                input.datePicker({
                    horizontalPosition: $.dpConst.POS_RIGHT,
                    displayClose: true,
                    startDate: new Date(1900, 1, 1)
                });

                var lnk = input.parent().find('.dp-choose-date');
                input.wrap(
                    '<div class="row collapse"><div class="small-10 columns"/></div>');
                lnk.addClass('button secondary postfix');
                lnk.html('<i class="fi-calendar"></i>');
                lnk.wrap('<div class="small-2 columns"/>');
                lnk.parent().insertAfter(input.parent());
            });
        }

        elem.find('textarea.autogrow, .autogrow textarea').autogrow();
    });

    onReady.push(function() { initForms(); });

    /* inject function into the global namespace */
    if (!window.initForms) window.initForms = initForms;

    $(document.body).on('updateLive', function(event, elem) {
        event.stopPropagation();
        elem.flash();
        initForms(elem);
    });
})(jQuery);


/* ajax modals */
(function($) {
    var initModal = function() {
            var modal = this,
                $elem = $(this);

            $elem.find('form').each(function() {
                var $form = $(this),
                    handleResponse = function(data) {
                        window.modalLoad.locked = false;

                        if (typeof(data) == 'string') {
                            $elem.html(data);
                            initModal.call($elem.get(0));
                        } else {
                            updateLive(data);
                            if (!('!keep' in data))
                                $elem.foundation('reveal', 'close');
                        }
                    }

                // set modal to locked: navigating away will be prevented
                // and also closing the modal will prompt the user
                $form.filter('[method="post"]').on('change', function(event) {
                    window.modalLoad.locked = true;
                });

                $form.on('submit', function() {
                    if (this.method.toLowerCase() == 'post') {
                        if ($.fn.ajaxSubmit) {
                            // jquery.form.js is available, XHR file uploads will
                            // work too
                            var $bar = $elem.find('.meter');

                            $(this).ajaxSubmit({
                                uploadProgress: function(evt, pos, total, percComplete) {
                                    $bar.width(percComplete + '%');
                                },
                                beforeSubmit: function() {
                                    $bar.width('0%');
                                },
                                success: handleResponse
                            });
                        } else {
                            $.post(this.action, $form.serialize(), handleResponse);
                        }
                    } else {
                        $.get(this.action, $form.serialize(), handleResponse);
                    }
                    return false;
                });

                // focus the first form element
                (function(form) {
                    setTimeout(function() {
                        initForms(form);
                        $('input:visible, textarea', form).first().focus();
                    }, 150);
                })(this);
            });
        },
        modalLoad = function(url, cls) {
            var modal = $('div.reveal-modal');
            if (!modal.length) {
                /* create div for holding AJAX-loaded modals, once */
                modal = $('<div data-reveal class="reveal-modal"/>').appendTo('body');
                modal.on('close', function(event) {

                    if (event.target != this) {
                        // another element triggered the hide event. Ignore it.
                        return true;
                    }

                    // if the modal is locked (i.e. uploading/submission in progress)
                    if (window.modalLoad.locked) {
                        if (!confirm(gettext('You have unsaved changes. Do you really want to throw them away?'))) {
                            return false;
                        }
                    }

                    // unlock the modal
                    window.modalLoad.locked = false;
                    $('#logo').focus().blur();
                });
            }

            modal.removeClass().addClass('reveal-modal');
            if (cls)
                modal.addClass(cls);

            modal.empty().load(url, function() {
                var $m = $(this),
                    cls = $m.find('[data-reveal-class]').data('reveal-class');
                if (cls)
                    $m.addClass(cls);
                initModal.call(this);
                $m.foundation('reveal', 'open');
            });
        };

    $(document.body).on('click', 'a[data-toggle="ajaxmodal"]', function(e) {
        e.preventDefault();
        // close everything related to reveal -- is necessary because
        // otherwise foundation.reveal.js trips and falls.
        $('.reveal-modal, .reveal-modal-bg').remove();
        modalLoad(this.href, $(this).data('reveal-class'));
    });

    // prevent navigating away without saving:
    $(window).on('beforeunload', function() {
        if (window.modalLoad.locked) {
          return gettext('You have unsaved changes. Do you really want to throw them away?')
        };
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
