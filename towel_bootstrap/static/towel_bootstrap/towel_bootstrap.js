;
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
