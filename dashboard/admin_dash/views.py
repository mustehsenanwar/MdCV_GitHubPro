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


class DashboardPage(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
    # Default template file
    # Refer to dashboards/urls.py file for more pages and template files
    template_name = 'dashboard/admin_templates/dashboard.html'

    def test_func(self):
        # This function tests whether the logged-in user is a superuser
        return self.request.user.is_superuser or self.request.user.is_staff

    # Predefined function
    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)

        """
        # Example to get page name. Refer to dashboards/urls.py file.
        url_name = resolve(self.request.path_info).url_name

        if url_name == 'dashboard-2':
            # Example to override settings at the runtime
            settings.KT_THEME_DIRECTION = 'rtl'
        else:
            settings.KT_THEME_DIRECTION = 'ltr'
        """

        # A function to init the global layout. It is defined in core/__init__.py file
        context = KTLayout.init(context)

        # Include vendors and javascript files for dashboard widgets
        KTTheme.addVendors(['amcharts', 'amcharts-maps', 'amcharts-stock'])
        context['user'] = self.request.user
        return context

    def handle_no_permission(self):
        # Redirect non-staff and non-superuser users to a different page (e.g., homepage)
        # return HttpResponseRedirect(reverse('home'))  # 'home' should be the name of your homepage URL pattern
        return HttpResponse('you are at home pge')


class AllUsersPage(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
    # Default template file
    # Refer to dashboards/urls.py file for more pages and template files
    template_name = 'dashboard/admin_templates/allusers.html'

    def test_func(self):
        # This function tests whether the logged-in user is a superuser
        return self.request.user.is_superuser

    # Predefined function
    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        context = KTLayout.init(context)
        KTTheme.addVendors(['amcharts', 'amcharts-maps', 'amcharts-stock'])

        all_users = CustomUser.objects.exclude(is_superuser=True)
        departments = Department.objects.all()  # Query all departments

        context['all_users'] = all_users
        context['departments'] = departments  # Add the departments to the context
        context['user'] = self.request.user

        return context

    def post(self, request, *args, **kwargs):
        if 'delete_user' in request.POST:
            user_id = request.POST.get('contact_id')  # Ensure this matches the name attribute in your form
            try:
                user = CustomUser.objects.get(id=user_id)
                user.delete()
                messages.success(request, "User deleted successfully.")
            except CustomUser.DoesNotExist:
                messages.error(request, "User not found.")
            except Exception as e:
                messages.error(request, f"An error occurred while trying to delete the user: {e}")

            return redirect('dashboard:allusers')
        else:
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


class DepartmentsListPage(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
    template_name = 'dashboard/admin_templates/departments.html'
    def test_func(self):
        return self.request.user.is_superuser
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context = KTLayout.init(context)
        KTTheme.addVendors(['amcharts', 'amcharts-maps', 'amcharts-stock'])

        departments = Department.objects.all()
        activity_tags = ActivityTag.objects.all()  # Fetch all activity tags
        context.update({
            'departments': departments,
            'activity_tags': activity_tags,  # Add activity tags to the context
            'user': self.request.user,
        })
        return context

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        return render(request, self.template_name, context)

    def post(self, request, *args, **kwargs):
        # Handle the form submission for adding a new department
        if 'add_department' in request.POST:
            department_name = request.POST.get('add_department')
            selected_tags_ids = request.POST.getlist('activity_tags')  # IDs of selected tags

            if department_name:
                department, created = Department.objects.get_or_create(name=department_name)
                if created:
                    try:
                        for tag_id in selected_tags_ids:
                            tag = ActivityTag.objects.get(id=tag_id)
                            department.activities.add(tag)
                        messages.success(request, 'Department and activities added successfully!')
                    except ActivityTag.DoesNotExist:
                        messages.error(request, 'One or more selected activities do not exist.')
                else:
                    messages.info(request, 'Department already exists.')
            else:
                messages.error(request, 'Department name is required.')



        # Handle the form submission for deleting a department
        elif 'delete_department' in request.POST:
            department_id = request.POST.get('department_id')
            try:
                department = Department.objects.get(pk=department_id)
                department.delete()
                messages.success(request, 'Department deleted successfully!')
            except Department.DoesNotExist:
                messages.error(request, 'Department not found.')
            except ProtectedError:
                messages.error(request, 'This department cannot be deleted because it is protected.')

        # Redirect back to the same page to refresh the context and show the updated department list
        return redirect(
            'dashboard:departments')  # Update 'dashboard:departments_list' to your actual URL name for the departments list page

    def handle_no_permission(self):
        return HttpResponse('you are at home pge')