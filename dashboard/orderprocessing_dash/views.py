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





class AllOrdersPage(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
    # Default template file
    # Refer to dashboards/urls.py file for more pages and template files
    template_name = 'dashboard/admin_templates/allusers.html'

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

        all_users = CustomUser.objects.exclude(is_superuser=True)
        departments = Department.objects.all()  # Query all departments
        activity_tags = self.request.session.get('activity_tags', [])


        context['all_users'] = all_users
        context['departments'] = departments  # Add the departments to the context
        context['user'] = self.request.user


        return context

    def post(self, request, *args, **kwargs):
        user_id = request.POST.get('user_id')  # You need to include a hidden input in your form for 'user_id'
        new_department_id = request.POST.get('new_department')

        print(user_id)
        print(new_department_id)

        # Get the user object based on user_id
        user = get_object_or_404(CustomUser, id=user_id)

        if new_department_id:
            # Get the department object based on new_department_id
            department = get_object_or_404(Department, id=new_department_id)
            user.department = department  # Update the user's department
            user.is_staff = True  # Set the user as a staff member
            user.save()
            messages.success(request, f"{user.get_full_name()}'s department updated successfully!")
        else:
            messages.error(request, "Please select a department.")

        return redirect('dashboard:allusers')  # Redirect back to the all users page

    def handle_no_permission(self):
        return HttpResponse('you are at home pge')
