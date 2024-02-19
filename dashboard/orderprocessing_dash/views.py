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
from orders.models import Order
from django.http import JsonResponse
from orders.models import OrderFiles




class AllOrdersPage(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
    # Default template file
    # Refer to dashboards/urls.py file for more pages and template files
    template_name = 'dashboard/orderprocessing_templates/allusers.html'

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

        context['orders'] = Order.objects.all()  # Add all orders to the context
        context['user'] = self.request.user


        return context

    def get(self, request, *args, **kwargs):
        print('just started')
        # Check if it's an AJAX request by examining the HTTP headers
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            order_id = request.GET.get('order_id')  # Get the order ID from the AJAX request

            if order_id:
                print(order_id)
                # Fetch the order files for the given order ID
                order_files = OrderFiles.objects.filter(order__id=order_id).values('file', 'file_type', 'id')
                print(len(order_files))
                # Return the order files as JSON
                return JsonResponse(list(order_files), safe=False)

        # If not an AJAX request, continue with the normal get_context_data flow
        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        order_id = request.POST.get('order_id')
        template_option = request.POST.get('template_option')
        order = get_object_or_404(Order, pk=order_id)
        print(order_id)
        print(template_option)
        if order.order_status != 'pending':
            print('not pending')
            return JsonResponse({'status': 'error', 'message': 'This order is already being processed'})

        # Update the order status to 'processing'
        order.order_status = 'processing'
        order.save()

        # Determine the redirect URL based on the template option selected
        if template_option == 'default':
            redirect_url = reverse('dashboard:resumebuilder', args=[order_id])
        else:
            redirect_url = reverse('dashboard:template_selection')
        print(redirect_url)
        return JsonResponse({'status': 'success', 'redirect_url': redirect_url})

    def handle_no_permission(self):
        return HttpResponse('you are at home pge')

class ResumeBuilder(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
    # Default template file
    # Refer to dashboards/urls.py file for more pages and template files
    template_name = 'dashboard/orderprocessing_templates/resumebuilder.html'

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

        context['user'] = self.request.user


        return context




    def handle_no_permission(self):
        return HttpResponse('you are at home pge')


class TemplateSelection(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
    # Default template file
    # Refer to dashboards/urls.py file for more pages and template files
    template_name = 'dashboard/orderprocessing_templates/template_selection.html'

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

        context['user'] = self.request.user


        return context




    def handle_no_permission(self):
        return HttpResponse('you are at home pge')
