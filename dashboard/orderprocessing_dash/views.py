from django.views.generic import TemplateView

from django.http import HttpResponse
from django.conf import settings
from django.urls import resolve
from core.__init__ import KTLayout
from core.libs.theme import KTTheme
from pprint import pprint
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.urls import reverse
from django.views.generic import TemplateView
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth import get_user_model
CustomUser = get_user_model()
from dashboard.models import Department,ActivityTag
from django.shortcuts import render, redirect
from django.contrib import messages
from django.shortcuts import get_object_or_404
from django.db import IntegrityError
from orders.models import Order,OrderStatusUpdate, OrderInitialData, OrderInitialFiles,OrderParse, OrderFinalizedData
from django.http import JsonResponse
from resume_templates.models import Template, Variation
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json


class MyOrdersPage(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
    # Default template file
    # Refer to dashboards/urls.py file for more pages and template files
    template_name = 'orders/myorders.html'

    def test_func(self):
        activity_tags = self.request.session.get('activity_tags', [])
        if "orderprocessing" in activity_tags:
            return True

        return self.request.user.is_superuser

    # Predefined function
    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        context = KTLayout.init(context)
        KTTheme.addVendors(['amcharts', 'amcharts-maps', 'amcharts-stock'])
        user_orders = Order.objects.filter(status_updates__updated_by=self.request.user).distinct().order_by('created_at')

        context['myorders'] = user_orders  # Add filtered orders to the context
        context['user'] = self.request.user

        return context


        return context


    def handle_no_permission(self):
        return HttpResponse('you are at home pge')

class AllOrdersPage(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
    # Default template file
    # Refer to dashboards/urls.py file for more pages and template files
    template_name = 'orders/allusers.html'

    def test_func(self):
        activity_tags = self.request.session.get('activity_tags', [])
        if "orderprocessing" in activity_tags:
            return True

        return self.request.user.is_superuser

    # Predefined function
    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        context = KTLayout.init(context)
        KTTheme.addVendors(['amcharts', 'amcharts-maps', 'amcharts-stock'])
        OrderList = Order.objects.all().order_by('created_at')
        context['orders'] = OrderList  # Add all orders to the context
        context['user'] = self.request.user


        return context

    def get(self, request, *args, **kwargs):
        # Check if it's an AJAX request by examining the HTTP headers
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            order_id = request.GET.get('order_id')  # Get the order ID from the AJAX request
            if order_id:
                # Fetch the order files for the given order ID
                order_files = OrderInitialFiles.objects.filter(order__id=order_id).values('file', 'file_type', 'id')
                print(order_files)
                # Return the order files as JSON
                return JsonResponse(list(order_files), safe=False)

        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        order_id = request.POST.get('order_id')
        order = get_object_or_404(Order, pk=order_id)
        if order.order_status != 'pending':
            return JsonResponse({'status': 'error', 'message': 'This order is already being processed'})
        previous_status = order.order_status  # Store the previous status
        order.order_status = 'processing'
        order.save()

        # Create a new OrderStatusUpdate instance to log this change
        OrderStatusUpdate.objects.create(
            order=order,
            updated_by=request.user,
            previous_status=previous_status,
            current_status='processing'
        )

        redirect_url = reverse('dashboard:template_list', kwargs={'order_id': order_id})  # Assuming you have a URL pattern named 'template_list'
        return JsonResponse({'status': 'success', 'redirect_url': redirect_url})

    def handle_no_permission(self):
        return HttpResponse('you are at home pge')

# class ResumeBuilder(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
#     template_name = 'resume_templates/all_resume_templates/template1.html'

#     def test_func(self):
#         activity_tags = self.request.session.get('activity_tags', [])
#         if "orderprocessing" in activity_tags:
#             return True
#         return self.request.user.is_superuser

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         context = KTLayout.init(context)
#         KTTheme.addVendors(['amcharts', 'amcharts-maps', 'amcharts-stock'])
#         context['user'] = self.request.user

#         # Assuming 'order_id' is passed to the template context by some means
#         order_id = self.kwargs.get('order_id')
#         parsed_data = OrderParse.objects.filter(order_id=order_id).first()
#         finalized_data = OrderFinalizedData.objects.filter(order_id=order_id).first()

#         if parsed_data:
#             data = parsed_data.parsed_data
#             if finalized_data:
#                 data.update(finalized_data.finalized_data)  # Merge with preference to finalized data
#             context['resume_data'] = data
#         context['order_id'] = order_id
#         return context

#     def handle_no_permission(self):
#         return HttpResponse('You are at home page')

#     @method_decorator(csrf_exempt)  # Disable CSRF for this view, consider a better method for production
#     def dispatch(self, *args, **kwargs):
#         return super(ResumeBuilder, self).dispatch(*args, **kwargs)

#     def post(self, request, *args, **kwargs):
#         try:
#             data = json.loads(request.body)
#             action = data.get('action')

#             if action == 'fetch':
#                 print("i am fetching")
#                 # Retrieve 'order_id' from the URL kwargs or request body
#                 order_id = self.kwargs.get('order_id') or data.get('order_id')

#                 try:
#                     order_finalized_data = OrderFinalizedData.objects.get(order__id=order_id)
#                     resume_data = order_finalized_data.finalized_data  # This is a JSON field
#                     print(resume_data)
#                     return JsonResponse({'status': 'success', 'action': 'fetch', 'data': resume_data})
#                 except ObjectDoesNotExist:
#                     return JsonResponse({'status': 'error', 'message': f'Order with id {order_id} not found'}, status=404)


#             elif action == 'update':
#                 # Handle update action
#                 # Update the resume data based on your logic and the provided data
#                 # update_data = data.get('resumeData')
#                 print("i am updating")
#                 order_id = self.kwargs.get('order_id') or data.get('order_id')  # Assuming order_id is passed in the URL
#                 update_data = data.get('resumeData')  # Your new resume data in the request body

#                 # Find the OrderFinalizedData instance
#                 try:
#                     order_finalized_data = OrderFinalizedData.objects.get(order_id=order_id)
#                     # Update the finalized_data field with new data
#                     order_finalized_data.finalized_data = update_data
#                     order_finalized_data.save()  # Don't forget to save the changes

#                     return JsonResponse({'status': 'success', 'action': 'update', 'message': 'Data updated successfully'})

#                 except ObjectDoesNotExist:
#                     return JsonResponse({'status': 'error', 'message': 'Order not found'}, status=404)

#             else:
#                 # Handle unknown action
#                 return JsonResponse({'status': 'error', 'message': 'Unknown action'}, status=400)

#         except Exception as e:
#             return JsonResponse({'status': 'error', 'message': str(e)}, status=400)





# class TemplateList(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
#     template_name = 'resume_templates/templates_list.html'

#     def test_func(self):
#         activity_tags = self.request.session.get('activity_tags', [])
#         if "orderprocessing" in activity_tags:
#             return True
#         return self.request.user.is_superuser
#     def get_context_data(self, **kwargs):
#         # Call the base implementation first to get a context
#         context = super().get_context_data(**kwargs)
#         context = KTLayout.init(context)
#         KTTheme.addVendors(['amcharts', 'amcharts-maps', 'amcharts-stock'])
#         order_id = self.kwargs.get('order_id')

#         if order_id:
#             try:
#                 order_initial_data = OrderInitialData.objects.get(order_id=order_id)
#                 selected_variation = order_initial_data.template_variation_selected
#             except OrderInitialData.DoesNotExist:
#                 pass  # Handle the case where no OrderInitialData exists for the given order_id
#         resume_all_variations = Template.objects.prefetch_related('variations').all()
#         context['templates'] = resume_all_variations
#         context['selected_variation'] = selected_variation  # Pass the selected variation to the template
#         context['order_id'] = order_id
#         context['user'] = self.request.user
#         return context

#     def post(self, request, *args, **kwargs):
#         # Process your form data here
#         selected_variation_id = request.POST.get('selected_variation')
#         order_id = request.POST.get('order_id')

#         # You might want to save this data or perform some action based on the form submission
#         # For example, updating an Order model with the selected variation
#         if order_id and selected_variation_id:
#             try:
#                 order = OrderInitialData.objects.get(order_id=order_id)
#                 order.template_variation_selected_id = selected_variation_id
#                 order.save()
#                 # Redirect after POST to prevent form resubmission issues
#                 return HttpResponseRedirect(reverse('dashboard:resumebuilder', args=(order_id,)))
#             except OrderInitialData.DoesNotExist:
#                 # Handle case where order doesn't exist
#                 pass

#         # If there's no order_id or selected_variation_id, or if saving fails, re-render the page with existing context
#         context = self.get_context_data(**kwargs)
#         return self.render_to_response(context)
#     def handle_no_permission(self):
#         return HttpResponse('You are at the home page')


# class CreateNewTemplate(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
#     template_name = 'resume_templates/create_new_template.html'

#     def test_func(self):
#         activity_tags = self.request.session.get('activity_tags', [])
#         if "orderprocessing" in activity_tags:
#             return True

#         return self.request.user.is_superuser

#     # Predefined function
#     def get_context_data(self, **kwargs):
#         # Call the base implementation first to get a context
#         context = super().get_context_data(**kwargs)
#         context = KTLayout.init(context)
#         KTTheme.addVendors(['amcharts', 'amcharts-maps', 'amcharts-stock'])

#         context['user'] = self.request.user
#         return context

#     def get(self, request, *args, **kwargs):
#         templates = Template.objects.all()
#         return render(request, self.template_name, {'templates': templates, **self.get_context_data(**kwargs)})
#     def post(self, request, *args, **kwargs):

#         if 'template_name' in request.POST:  # This indicates a new template form submission
#             template_name = request.POST['template_name']
#             is_default = 'is_default' in request.POST
#             Template.objects.create(name=template_name, is_default=is_default)
#         elif 'variation_name' in request.POST:  # This indicates a new variation form submission
#             template_id = request.POST['template']
#             variation_name = request.POST['variation_name']
#             thumbnail = request.FILES.get('thumbnail')
#             file = request.FILES.get('file')
#             template = Template.objects.get(id=template_id)
#             Variation.objects.create(template=template, variation_name=variation_name, thumbnail=thumbnail, file=file)
#         return redirect('dashboard:create_new_template')  # Redirect back to the form page


#     def handle_no_permission(self):
#         return HttpResponse('You are at the home page')