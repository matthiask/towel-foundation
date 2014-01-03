import json

from django.http import HttpResponse

from towel.modelview import ModelView
from towel.utils import changed_regions, safe_queryset_and


class PickerModelView(ModelView):
    def picker(self, request):
        queryset = self.get_query_set(request)
        regions = None
        query = request.GET.get('query')

        if query is not None:
            queryset = safe_queryset_and(
                queryset,
                self.model.objects._search(query))
            regions = {}

        response = self.render(
            request,
            self.get_template(request, 'picker'),
            self.get_context(request, {
                self.template_object_list_name: queryset,
                'regions': regions,
            }))

        if query is not None:
            data = changed_regions(regions, ['object_list'])
            data['!keep'] = True  # Keep modal open
            return HttpResponse(
                json.dumps(data),
                content_type='application/json')

        return response
