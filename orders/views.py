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


class MyOrders(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
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

class OrdersList(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
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