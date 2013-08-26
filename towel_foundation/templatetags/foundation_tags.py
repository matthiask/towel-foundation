from django import template
from django.utils.formats import get_format


register = template.Library()


@register.simple_tag
def date_format():
    fmt = get_format('DATE_INPUT_FORMATS')[0]
    fmt = fmt.replace('%m', 'mm').replace('%d', 'dd').replace('%Y', 'yyyy')
    return fmt
