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
from dashboard.models import Department,ActivityTag
from django.shortcuts import render, redirect
from django.contrib import messages
from django.shortcuts import get_object_or_404
from django.db import IntegrityError
from dashboard.models import Contact, PreliminaryData, PreliminaryDataFile
from django.db import transaction
from django.core.files.storage import default_storage
from resume_templates.models import Template

CustomUser = get_user_model()



class InputOrderPage(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
    # Default template file
    # Refer to dashboards/urls.py file for more pages and template files
    template_name = 'dashboard/salesmarketing_templates/inputorder.html'

    def test_func(self):
        activity_tags = self.request.session.get('activity_tags', [])
        if "sales" in activity_tags:
            return True

        return self.request.user.is_superuser

    # Predefined function
    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        context = KTLayout.init(context)
        KTTheme.addVendors(['amcharts', 'amcharts-maps', 'amcharts-stock'])

        templates_with_variations = Template.objects.prefetch_related('variations').all()
        context['templates_with_variations'] = templates_with_variations
        context['user'] = self.request.user

        return context

    def get(self, request, *args, **kwargs):
        contacts = Contact.objects.all()
        return render(request, self.template_name, {'contacts': contacts, **self.get_context_data(**kwargs)})





    def post(self, request, *args, **kwargs):
        if 'update_payment_status' in request.POST:
            # Payment status update logic
            contact_id = request.POST.get('contact_id')
            payment_status = request.POST.get('payment_status')
            try:
                contact = Contact.objects.get(id=contact_id)
                contact.payment_status = payment_status
                contact.save()
                messages.success(request, "Payment status updated successfully.")
            except Contact.DoesNotExist:
                messages.error(request, "Contact not found.")
            except Exception as e:
                messages.error(request, f"An error occurred: {e}")

        elif 'delete_contact' in request.POST:
            # Contact delete logic
            contact_id = request.POST.get('contact_id')
            try:
                contact = Contact.objects.get(id=contact_id)
                contact.delete()
                messages.success(request, "Contact deleted successfully.")
            except Contact.DoesNotExist:
                messages.error(request, "Contact not found.")
            except Exception as e:
                messages.error(request, f"An error occurred: {e}")

        else:
            # New contact creation logic
            try:
                with transaction.atomic():
                    first_name = request.POST.get('first_name')
                    last_name = request.POST.get('last_name')
                    email = request.POST.get('email')
                    phone = request.POST.get('phone')
                    status = request.POST.get('status')
                    payment_status = request.POST.get('payment_status')
                    requirements = request.POST.get('requirements')
                    template_selection = request.POST.get('template_selection')
                    order_type = request.POST.get('order_type')


                    contact, created = Contact.objects.update_or_create(
                        email=email,
                        defaults={'first_name': first_name, 'last_name': last_name, 'phone': phone, 'status': status}
                    )


                    preliminary_data  = PreliminaryData.objects.create(
                        contact=contact,
                        requirements=requirements,
                        template_selection=template_selection,
                        # old_cv=old_cv_path,
                        # other_files = other_files_paths,
                        order_type=order_type,
                    )

                    if 'original_cv' in request.FILES:
                        PreliminaryDataFile.objects.create(
                            preliminary_data=preliminary_data,
                            file=request.FILES['original_cv'],
                            file_type='original_cv',
                        )
                    if 'original_pic' in request.FILES:
                        PreliminaryDataFile.objects.create(
                            preliminary_data=preliminary_data,
                            file=request.FILES['original_pic'],
                            file_type='original_pic',
                        )

                    for uploaded_file in request.FILES.getlist('other_files[]'):
                        PreliminaryDataFile.objects.create(
                            preliminary_data=preliminary_data,
                            file=uploaded_file,
                            file_type='other',
                        )

                    contact.payment_status = payment_status
                    contact.save()

                    messages.success(request, "Contact and preliminary data saved successfully.")
            except Exception as e:
                messages.error(request, f"An error occurred: {e}")

        return redirect('dashboard:inputorder')



        return redirect('dashboard:inputorder')




    def handle_no_permission(self):
        return HttpResponse('you are at home pge')
