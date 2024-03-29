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
from resume_templates.models import Template, Variation, VariationSetting,DefaultVariation
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
from django.db import transaction
import qrcode
from io import BytesIO
from PIL import Image
import base64

# from weasyprint import HTML
# from django.template.loader import render_to_string
import os
# Create your views here.

class ResumeBuilder(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
    template_name = 'resume_templates/index.html'

    def test_func(self):
        activity_tags = self.request.session.get('activity_tags', [])
        if "orderprocessing" in activity_tags:
            return True
        return self.request.user.is_superuser

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context = KTLayout.init(context)
        KTTheme.addVendors(['amcharts', 'amcharts-maps', 'amcharts-stock'])
        context['user'] = self.request.user

        # Assuming 'order_id' is passed to the template context by some means
        order_id = self.kwargs.get('order_id')
        # parsed_data = OrderParse.objects.filter(order_id=order_id).first()
        finalized_data = OrderFinalizedData.objects.filter(order_id=order_id).first()

        # if finalized_data:
        #     order_resume = finalized_data.finalized_data  
        # context['resume_data'] = order_resume
        context['order_id'] = order_id
        return context

    def handle_no_permission(self):
        return HttpResponse('You are at home page')

    @method_decorator(csrf_exempt)  # Disable CSRF for this view, consider a better method for production
    def dispatch(self, *args, **kwargs):
        return super(ResumeBuilder, self).dispatch(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            action = data.get('action')

            if action == 'fetch':
                print("i am fetching")
                # Retrieve 'order_id' from the URL kwargs or request body
                order_id = self.kwargs.get('order_id') or data.get('order_id')
                
                try:
                    order_finalized_data = OrderFinalizedData.objects.get(order__id=order_id)
                    resume_data = order_finalized_data.finalized_data  # This is a JSON field
                    
                    # Generate QR code for the order
                    qr_url = f"https://yourdomain.com/order/{order_id}/"  # Construct the URL with the order's UUID
                    qr_img = generate_qr_code(qr_url)  # Call the QR code generation function
                    
                    # Convert QR code image to Data URL
                    buffer = BytesIO()
                    qr_img.save(buffer, format="PNG")
                    img_str = base64.b64encode(buffer.getvalue()).decode()
                    qr_data_url = f"data:image/png;base64,{img_str}"

                    
                    # Access the Order linked to the OrderFinalizedData
                    linked_order = order_finalized_data.order

                    # Try to get the OrderInitialData related to the linked Order
                    order_initial_data = OrderInitialData.objects.filter(order=linked_order).first()

                    if order_initial_data and order_initial_data.template_variation_selected:
                        selected_variation = order_initial_data.template_variation_selected
                        try:
                            # Access the settings JSON field of the VariationSetting linked to the selected Variation
                            variation_settings = selected_variation.settings.settings
                        except VariationSetting.DoesNotExist:
                            variation_settings = {}  # Fallback to empty settings if VariationSetting does not exist
                    else:
                        variation_settings = {}  # Fallback to empty settings if no OrderInitialData or no selected Variation
                    
                    return JsonResponse({
                        'status': 'success',
                        'action': 'fetch',
                        'data': resume_data,
                        'settings': variation_settings,  # Send the variation settings along with the resume data
                        'qr_code': qr_data_url,  # Include the QR code Data URL in the response
                    })

                except OrderFinalizedData.DoesNotExist:
                    return JsonResponse({'status': 'error', 'message': f'Order with id {order_id} not found'}, status=404)

            elif action == 'update':
                update_data = data.get('resumeData')
                print(update_data)
                order_id = self.kwargs.get('order_id') or data.get('order_id')  # Assuming order_id is passed in the URL
                # return JsonResponse({'status': 'success', 'action': 'update', 'message': 'Data updated successfully'})
                # Find the OrderFinalizedData instance
                try:
                    order_finalized_data = OrderFinalizedData.objects.get(order__id=order_id)
                    finalized_data = order_finalized_data.finalized_data  # This is the current JSON data stored in the database

                    for section_key in ['static_sections', 'one', 'two']:
                        if section_key in finalized_data:
                            for section in finalized_data[section_key]:
                                if section.get('target') == update_data.get('data', {}).get('target'):
                                    print(update_data.get('data')['data'])
                                    section['data'] = update_data.get('data')['data']
                                    print(section['data'])
                                    break 


                    # Save the updated JSON back to the database
                    order_finalized_data.finalized_data = finalized_data
                    order_finalized_data.save()

                    # Return a success response
                    return JsonResponse({'status': 'success', 'action': 'update', 'message': 'Data updated successfully'})

                except ObjectDoesNotExist:
                    return JsonResponse({'status': 'error', 'message': 'Order not found'}, status=404)

            
            # elif action == 'generate_pdf':
            #     print("pdf generation request received")
            #     html_content = data.get('html')  # The HTML content from the AJAX request
                
            #     order_id = self.kwargs.get('order_id') or data.get('order_id')  # Retrieve 'order_id'

            #     try:
            #         # Generate PDF from the HTML content
            #         html = HTML(string=html_content, base_url=request.build_absolute_uri())
            #         print("writing PDF")
            #         pdf = html.write_pdf()
            #         print("writing finishedddddd PDF")
            #         # Define the path for the new PDF file
            #         pdf_filename = f"resume_{order_id}.pdf"
            #         pdf_path = os.path.join(settings.MEDIA_ROOT, 'resumes', pdf_filename)

            #         # Ensure the directory exists
            #         os.makedirs(os.path.dirname(pdf_path), exist_ok=True)

            #         # Write the PDF data to a file
            #         with open(pdf_path, 'wb') as pdf_file:
            #             pdf_file.write(pdf)

            #         # Here, you might want to save a reference to the file in your database
            #         print("final stage start")
            #         # Return a success response
            #         return JsonResponse({'status': 'success', 'message': 'PDF generated successfully', 'file_path': os.path.join(settings.MEDIA_URL, 'resumes', pdf_filename)})

            #     except Exception as e:
            #         return JsonResponse({'status': 'error', 'message': f'Failed to generate PDF: {str(e)}'}, status=500)

            
            else:
                # Handle unknown action
                return JsonResponse({'status': 'error', 'message': 'Unknown action'}, status=400)

                    
            


        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)


def generate_qr_code(url, fill_color="black", back_color="yellow", box_size=5, border=4):
    """
    Generate a QR code.

    :param url: The URL or text to encode in the QR code.
    :param fill_color: The color of the QR code (default: "black").
    :param back_color: The background color (default: "white").
    :param box_size: The size of each box in pixels (default: 10).
    :param border: The border size in boxes (default: 4).
    :return: A PIL Image object of the generated QR code.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=box_size,
        border=border,
    )
    qr.add_data(url)
    qr.make(fit=True)

    # Generate the QR code image
    img = qr.make_image(fill_color=fill_color, back_color=back_color)
    return img




class TemplateList(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
    template_name = 'resume_templates/templates_list.html'

    def test_func(self):
        activity_tags = self.request.session.get('activity_tags', [])
        if "orderprocessing" in activity_tags:
            return True
        return self.request.user.is_superuser
    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        context = KTLayout.init(context)
        KTTheme.addVendors(['amcharts', 'amcharts-maps', 'amcharts-stock'])
        order_id = self.kwargs.get('order_id')

        if order_id:
            try:
                order_initial_data = OrderInitialData.objects.get(order_id=order_id)
                selected_variation = order_initial_data.template_variation_selected
            except OrderInitialData.DoesNotExist:
                pass  # Handle the case where no OrderInitialData exists for the given order_id
        resume_all_variations = Template.objects.prefetch_related('variations').all()
        context['templates'] = resume_all_variations
        context['selected_variation'] = selected_variation  # Pass the selected variation to the template
        context['order_id'] = order_id
        context['user'] = self.request.user
        return context

    def post(self, request, *args, **kwargs):
        # Process your form data here
        selected_variation_id = request.POST.get('selected_variation')
        order_id = request.POST.get('order_id')

        # You might want to save this data or perform some action based on the form submission
        # For example, updating an Order model with the selected variation
        if order_id and selected_variation_id:
            try:
                order = OrderInitialData.objects.get(order_id=order_id)
                order.template_variation_selected_id = selected_variation_id
                order.save()
                # Redirect after POST to prevent form resubmission issues
                return HttpResponseRedirect(reverse('dashboard:resumebuilder', args=(order_id,)))
            except OrderInitialData.DoesNotExist:
                # Handle case where order doesn't exist
                pass

        # If there's no order_id or selected_variation_id, or if saving fails, re-render the page with existing context
        context = self.get_context_data(**kwargs)
        return self.render_to_response(context)
    def handle_no_permission(self):
        return HttpResponse('You are at the home page')

class CreateNewTemplate(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
    template_name = 'resume_templates/create_new_template.html'

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

    def get(self, request, *args, **kwargs):
        templates = Template.objects.all()
        return render(request, self.template_name, {'templates': templates, **self.get_context_data(**kwargs)})
    def post(self, request, *args, **kwargs):

        if 'template_name' in request.POST:  # This indicates a new template form submission
            template_name = request.POST['template_name']
            Template.objects.create(name=template_name)
        elif 'variation_name' in request.POST:  # This indicates a new variation form submission
            template_id = request.POST['template']
            variation_name = request.POST['variation_name']
            thumbnail = request.FILES.get('thumbnail')
            file = request.FILES.get('file')
            is_default_variation = request.POST.get('is_default_variation') == 'on'
            defffalu = request.POST.get('is_default_variation')
            print("defffalu value is : ")
            print(defffalu)
            
            # Default settings for the new VariationSetting
            variation_settings = {
                'layout': {
                    'static_targets': ['personalinfo', 'profile_summary'],
                    'one_targets': ['education', 'achievements', 'softSkill', 'languages', 'hobbies', 'references'],
                    'two_targets': ['experience', 'certificates', 'skills']
                }
                # Add more default settings as needed
            }

            template = Template.objects.get(id=template_id)
            new_variation = Variation.objects.create(
                template=template, 
                variation_name=variation_name, 
                thumbnail=thumbnail, 
                file=file
            )

            # Create VariationSetting for the new Variation
            VariationSetting.objects.create(
                variation=new_variation,
                settings=variation_settings
            )

            # If the new variation is marked as the default, ensure it's the only default for this template
            print("default check")
            if is_default_variation:
                self.set_default_variation(variation_id=new_variation.id)
                print(new_variation.id)

        return redirect('dashboard:create_new_template')  # Redirect back to the form page


    def set_default_variation(self,variation_id):
        try:
            with transaction.atomic():  # Use a transaction to ensure data integrity
                # Retrieve the variation you want to set as default
                variation = Variation.objects.get(id=variation_id)
                
                # Check if a default variation already exists
                if DefaultVariation.objects.exists():
                    # Update the existing default variation
                    default_variation = DefaultVariation.objects.first()
                    default_variation.variation = variation
                else:
                    # Create a new default variation if it doesn't exist
                    default_variation = DefaultVariation(variation=variation)
                
                default_variation.save()
                return True, "Default variation set successfully."
        except Variation.DoesNotExist:
            return False, "Variation does not exist."
        except Exception as e:
            return False, str(e)



    def handle_no_permission(self):
        return HttpResponse('You are at the home page')
    