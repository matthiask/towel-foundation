from django import forms
from django.db.models import ObjectDoesNotExist
from django.db.models.fields import BLANK_CHOICE_DASH
from django.utils.encoding import force_text
from django.utils.safestring import mark_safe
try:
    from django.urls import reverse
except ImportError:
    from django.core.urlresolvers import reverse

from towel.utils import app_model_label


_PICKER_TEMPLATE = u'''
<div class="picker-widget">
    <a href="%(picker)s?field=%(field)s" class="picker-glass"
            data-toggle="ajaxmodal">
        <i class="fi-magnifying-glass"></i>
    </a>
    <div class="picker-select">
        %(select)s
    </div>
</div>
'''


class SelectWithPicker(forms.Select):
    def __init__(self, *args, **kwargs):
        self.model = kwargs.pop('model')
        self.request = kwargs.pop('request')
        super(SelectWithPicker, self).__init__(*args, **kwargs)

    def render(self, name, value, attrs=None, choices=()):
        active_set = self.model.objects.active_set(
            self.request.access,
            additional_ids=filter(None, [
                value,
                self.request.POST.get(name),
                self.request.GET.get(name),
            ]),
        )

        self.choices = BLANK_CHOICE_DASH + [
            (item.id, force_text(item)) for item in active_set]

        html = super(SelectWithPicker, self).render(
            name, value, attrs=attrs)

        picker = reverse('%s_%s_picker' % app_model_label(self.model))

        return mark_safe(_PICKER_TEMPLATE % {
            'select': html,
            'picker': picker,
            'field': attrs['id'],
            })


_AUTOCOMPLETION_TEMPLATE = u'''
%(hidden)s
<input type="text" id="%(id)s_typeahead" value="%(value_text)s"
    autocomplete="off">
<script>
onReady.push(function($) {
    var elem = $('#%(id)s'),
        searchingTimeout = null;

    $('#%(id)s_typeahead').typeahead({
        source: function (query, process) {
            if (!query) {
                if (searchingTimeout) {
                    clearTimeout(searchingTimeout);
                    searchingTimeout = null;
                }
                process([]);
            }

            searchingTimeout = setTimeout(function() {
                return $.getJSON('%(url)s', {q: query}, function(data) {
                    return process($.map(data.objects, function(item, idx) {
                        return item.__str__ + '{' + item.__pk__ + '}';
                    }));
                });
            }, 250);
        },
        matcher: function (item) { return true; },
        sorter: function(items) { return items; },
        updater: function(item) {
            var matches = item.match(/^(.*)\{(\d+)\}$/);
            if (matches) {
                elem.val(matches[2]);
                elem.trigger('change');
                return matches[1];
            }
            return item;
        },
        highlighter: function(item) {
            return item ? item.replace(/\{\d+\}$/, '') : '';
        }
    }).on('blur change', function() {
        if (!this.value)
            elem.val('');
    });
});
</script>
'''


class APIAutocompletionWidget(forms.TextInput):
    def __init__(self, *args, **kwargs):
        self.url = kwargs.pop('url')
        super(APIAutocompletionWidget, self).__init__(*args, **kwargs)

    def render(self, name, value, attrs=None):
        hidden = super(APIAutocompletionWidget, self).render(
            name, value, attrs=dict(attrs, type='hidden'))
        id_attr = attrs['id']
        value_text = ''

        if value:
            try:
                value_text = force_text(self.choices.queryset.get(pk=value))
            except (ObjectDoesNotExist, TypeError, ValueError):
                pass

        return mark_safe(_AUTOCOMPLETION_TEMPLATE % {
            'hidden': hidden,
            'id': id_attr,
            'url': self.url,
            'value_text': value_text,
            })
