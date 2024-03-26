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





from django.db import transaction
from django.db.models import F


from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist

from orders.models import Order, OrderInitialFiles, OrderParse,OrderFinalizedData

from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
import fitz  # PyMuPDF
import openai
import json



from orders.models import Order, OrderInitialFiles, OrderParse,OrderFinalizedData,OrderInitialData
from resume_templates.models import Variation, DefaultVariation   

from django.http import HttpResponse
from resume_templates.models import DefaultVariation   



import qrcode
from io import BytesIO
from PIL import Image
import base64

def qrcodee(request):
    img = generate_qr_code(url="https://www.google.com/")
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    # Convert the buffer contents into a base64-encoded string
    img_str = base64.b64encode(buffer.getvalue()).decode()
    # Create the Data URL
    img_data_url = f"data:image/png;base64,{img_str}"
    context = {'img_data_url': img_data_url}
    return render(request, 'dashboard/qrcodee.html', context)


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





def texteditorpage(request):
    return render(request, 'dashboard/test.html')
        
        


















from weasyprint import HTML
from django.http import HttpResponse
from django.template.loader import render_to_string

def generate_pdf(request):
    # Your context data that will be passed to the HTML template
    # context = {'some_data': 'This is some data for the PDF.'}
    
    # Render the HTML template with context data
    # html_string = render_to_string('dashboard/test.html')
    
    html_string = render_to_string('dashboard/test.html')
    
    html = HTML(string=html_string, base_url=request.build_absolute_uri())
    # Generate the PDF
    pdf = html.write_pdf()

    # Create an HTTP response with PDF as attachment
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="my_pdf.pdf"'

    return response

def showcv(request):
    return render(request, 'dashboard/test.html')




def dataparse(request):
    order_id = 94
    order_finalized_data = OrderFinalizedData.objects.get(order__id=order_id)
    finalized_data = order_finalized_data.finalized_data 
    
    update_data = {'data': {'target': 'personalinfo', 'heading': 'personalinfo', 'data': [{'name': 'Ok KARIKKAD', 'phone': '+971525080627', 'email': 'nidesh.hari@gmail.com', 'nationality': 'Indian', 'merital_status': '', 'dob': 'SEP-1987', 'drivingLicense': 'Not mentioned', 'linkedIn': '', 'country': ''}]}}

    target_value = update_data.get('data', {}).get('target')
    # print(target_value)
          
    for section_key in ['static_sections', 'one', 'two']:
        if section_key in finalized_data:
            for section in finalized_data[section_key]:
                if section.get('target') == update_data.get('data', {}).get('target'):
                    print(update_data.get('data')['data'])
                    section['data'] = update_data.get('data')['data']
                    print(section['data'])
                    break  
    
    order_finalized_data.finalized_data = finalized_data
    order_finalized_data.save()
    return HttpResponse('done')
    






# from django.template.loader import render_to_string
# from django.http import HttpResponse
# from django.template.loader import render_to_string
# from weasyprint import HTML
# import tempfile
# def html_to_pdf(request):
#     context = {
#         'name': "mustehsen",  # Example context data
#         # Include 
#         # other context data needed for the resume
#     }
    
#     html_string = render_to_string('resume_template.html', context)
#     html = HTML(string=html_string)
#     result = html.write_pdf()
    
#     # Generate the response
#     response = HttpResponse(result, content_type='application/pdf')
#     response['Content-Disposition'] = 'filename="resume.pdf"'

    # return response
















# def parse_order_originalcv(request):
#     order_id = 38
#     order = Order.objects.get(id=order_id)
#     cv_files_queryset = OrderInitialFiles.objects.filter(order=order, file_type='original_cv')

#     if cv_files_queryset.exists():  # Check if the queryset is not empty
#         cv_file = cv_files_queryset.first()  # Get the first object from the queryset
#         cv_file_path = cv_file.file.path  # Access the 'file' attribute and then get its full filesystem path
#         parsed_data = pdfparser(cv_file_path)  # Now you pass the file path to your parsing function
#         return HttpResponse(parsed_data)
#     else:
#         # Handle the case where no CV file is associated with the order
#         print("No original CV file found for this order.")






# def construct_messages(resume_text):
#     prompt = f"""
#     Given the following resume text, extract the relevant information and fill in the structured format provided.

#     Resume Text:
#     {resume_text}

#     Please fill in the following structured format based on the resume and if value not found place null:
#     {{
#         "name": "[Extract the full name from the resume]",
#         "PersonalInfo": {{
#             "Phone": "[Extract the phone number and write it in international format e.g +97155555555]",
#             "Email": "[Extract the email address]",
#             "Nationality": "[Extract the nationality]",
#             "VisaType": "[Extract the visa type, if mentioned, e.g visit visa , employment visa, resident visa ]",
#             "DOB": "[Extract the date of birth only month and year needed]",
#             "DrivingLicense": "[Indicate if a driving license is mentioned]"
#         }},
#         "Educations": [
#             {{
#                 "University": "[Extract the name of the university or institution]",
#                 "DegreeName": "[Extract the degree or qualification]",
#                 "Location": "[Extract the location of the university or institution]",
#                 "Date": "[Extract the date or duration of the each education]"
#             }}
#         ],
#         "JobHeadings": [
#             {{
#                 "CompanyName": "[Extract the company name]",
#                 "Position": "[Extract the job title or position]",
#                 "Date": "[Extract the date or duration of the employment]",
#                 "Location": "[Extract the location of the job]"
#             }}
#         ],
#         "YearsOfExperience": "[Extract or estimate the total years of experience]",
#         "Language": "[List the languages mentioned]",
#         "Hobbies": "[List any hobbies mentioned]"
#     }}
#     """
#     return [
#         {"role": "system", "content": "You are data analyser."},
#         {"role": "user", "content": prompt}
#     ]
# def generate_response_with_openai(resume_text):
#     client = openai.OpenAI(api_key="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")
#     message = construct_messages(resume_text)
#     chat_completion = client.chat.completions.create(
#         messages= message,
#         model="gpt-4",
#         temperature = 0.4,
#     )
#     return chat_completion.choices[0].message.content

# def extract_text_from_pdf(file_path):
#     text = ""
#     with fitz.open(file_path) as doc:
#         for page in doc:
#             text += page.get_text()
#     return text

# def pdfparser(cv_files):
#     if cv_files:
#         print(cv_files)
#         file_path = cv_files
#         resume_text = extract_text_from_pdf(file_path)

#         response_from_openai = generate_response_with_openai(resume_text)  # Use the extracted text as a prompt
#         print(response_from_openai)
#         response_from_openai = json.loads(response_from_openai)
#         context = {'response': response_from_openai,'original_cv_text' : resume_text}
#         return context


 


# def example_page(request):
    
    
#     processed_prompt = {'data': [{'target': 'personalinfo', 'heading': 'personalinfo', 'data': [{'name': 'ANEESH ANIYAN', 'phone': '+971505181614', 'email': 'aneeshaply@gmail.com', 'nationality': 'Indian', 'visaType': 'Employment', 'dob': 'Mar-1985', 'drivingLicense': 'Not mentioned'}]}, {'target': 'education', 'heading': 'EDUCATION', 'data': [{'degree': 'BSc Nursing', 'university': 'Rajiv Gandhi University of Health Sciences', 'location': 'India', 'date': '2015', 'description': 'Major subjects: Nursing Fundamentals, Medical-Surgical Nursing, Pharmacology, Pediatric Nursing, Community Health Nursing, Nursing Ethics and Law, Emergency and Trauma Nursing, Health Assessment'}, {'degree': 'Diploma Nursing', 'university': 'Karnataka State Diploma of Nursing examination board', 'location': 'India', 'date': '2007', 'description': 'Major subjects: Anatomy and Physiology, First Aid and CPR, Basic Medical Terminology'}]}, {'target': 'achievements', 'heading': 'ACHIEVEMENTS', 'data': [{'achievement': 'Maintained patient records and documentation accuracy', 'description': 'Facilitated efficient communication across shifts'}, {'achievement': 'Provided critical care to emergency patients', 'description': 'Ensured optimal patient outcomes'}, {'achievement': 'Displayed exceptional leadership', 'description': 'Mentored staff, enhanced communication skills, and fostered problem-solving abilities'}]}, {'target': 'softSkill', 'heading': 'SOFT SKILLS', 'data': [{'skill': 'Team Collaboration', 'description': 'Effective collaborator in multi-specialty teams'}, {'skill': 'Critical Thinking', 'description': 'Proficient in critical care and invasive procedures'}, {'skill': 'Problem-Solving Abilities', 'description': 'Consistently exceeding care standards'}, {'skill': 'Empathy', 'description': 'Known for compassionate, patient-centered approach'}, {'skill': 'Attention to Detail', 'description': 'Maintained accurate and complete documentation'}, {'skill': 'Communication Skills', 'description': 'Effective communication with healthcare professionals'}, {'skill': 'Stress Management', 'description': 'Respond effectively to emergency situations'}, {'skill': 'Adaptability', 'description': 'Prepared to provide life-saving interventions'}, {'skill': 'Patient Advocacy', 'description': 'Ensured patient safety and proper procedural setup'}, {'skill': 'Leadership Abilities', 'description': 'Displayed exceptional leadership qualities'}, {'skill': 'Continuous Learning', 'description': 'Committed to ongoing learning and staying updated with medical advancements'}, {'skill': 'Patient Education', 'description': 'Provided post-procedure care and patient education'}]}, {'target': 'languages', 'heading': 'LANGUAGES', 'data': [{'language': 'English', 'proficiency': 'Fluent'}, {'language': 'Malayalam', 'proficiency': 'Native'}, {'language': 'Hindi', 'proficiency': 'Fluent'}]}, {'target': 'experience', 'heading': 'PROFESSIONAL EXPERIENCE', 'data': [{'designation': 'Staff Nurse OT', 'companyName': 'SAUDI GERMAN HOSPITAL (UAE)', 'location': 'UAE', 'date': 'Jan 2022 to Present', 'description': "Prepare and maintain operating room environment, assist surgical team, monitor patients' vital signs, administer medications, maintain documentation, adhere to infection control protocols"}, {'designation': 'Staff Nurse OT & Cath Lab', 'companyName': 'MEDIPOINT HOSPITALS PVT LTD (INDIA)', 'location': 'India', 'date': 'Oct 2007 to Jun 2022', 'description': 'Assist in setup and operation of specialized equipment, ensure availability of surgical supplies, collaborate with surgical team, manage disposal of biohazardous waste, assist with wound closure and dressing application, monitor patients during procedures'}]}, {'target': 'skills', 'heading': 'PROFESSIONAL SKILLS', 'data': [{'skill': 'CPR', 'proficiency': 'Mastery'}, {'skill': 'Resuscitation', 'proficiency': 'Mastery'}, {'skill': 'Post-procedural Care', 'proficiency': 'Mastery'}, {'skill': 'Coronary Angiography', 'proficiency': 'Expert'}, {'skill': 'Renal and Peripheral Angiography', 'proficiency': 'Expert'}, {'skill': 'Percutaneous Transluminal Coronary Angioplasty', 'proficiency': 'Expert'}, {'skill': 'Implantation of Pacemakers and ICDs', 'proficiency': 'Expert'}, {'skill': 'Aortic and Pulmonary Balloon Dilatation', 'proficiency': 'Expert'}, {'skill': 'Cerebral Catheterization', 'proficiency': 'Expert'}, {'skill': 'Pericardial Effusion Tapping', 'proficiency': 'Expert'}, {'skill': 'Intravascular Foreign Body Retrieval', 'proficiency': 'Expert'}, {'skill': 'Orthopedic Surgeries', 'proficiency': 'Expert'}, {'skill': 'Laparoscopic Surgeries', 'proficiency': 'Expert'}, {'skill': 'Gynecological Surgeries', 'proficiency': 'Expert'}, {'skill': 'General Surgeries', 'proficiency': 'Expert'}, {'skill': 'Neurosurgeries', 'proficiency': 'Expert'}, {'skill': 'Ophthalmic Surgeries', 'proficiency': 'Expert'}, {'skill': 'ENT Surgeries', 'proficiency': 'Expert'}, {'skill': 'Urology Surgeries', 'proficiency': 'Expert'}, {'skill': 'Reconstruction and Maxillofacial Surgeries', 'proficiency': 'Expert'}]}]}  
#     one_targets = ['personalinfo', 'education']  # Example targets for 'one'
#     two_targets = ['experience', 'skills']  # Example targets for 'two'

#     formated_template_data = {'static_sections' : [], 'one': [],'two': []}
    
    
    
#     default_variation_instance = DefaultVariation.objects.first()  # Fetch the DefaultVariation instance
#     if default_variation_instance:
#         default_variation = default_variation_instance.variation
#         variation_types = default_variation.variation_types
        
#     one_targets = variation_types['one_targets']
#     two_targets = variation_types['two_targets']
#     static_targets = variation_types['static_targets']
    
    
#     for section_key, section_value in processed_prompt.items():
#     # Check if the current section's target is in one_targets or two_targets
#         for item in section_value:
#             if item['target'] in one_targets:
#                 formated_template_data['one'].append(item)
#                 print("item added in one")
#             elif item['target'] in two_targets:
#                 formated_template_data['two'].append(item)
#                 print("item added in two")
#             elif item['target'] in static_targets:
#                 formated_template_data['static_sections'].append(item)
#                 print("item added in static_sections")
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    # for section_key, section_value in processed_prompt.items():

    #     # Check if the current section's target is in one_targets or two_targets
    #     if section_value['target'] in one_targets:
    #         formated_template_data['one'].append(section_value)
    #         print("item added in one")
    #     elif section_value['target'] in two_targets:
    #         formated_template_data['two'].append(section_value)
    #         print("item added in two")
    #     elif section_value['target'] in static_targets:
    #         formated_template_data['static_sections'].append(section_value)
    #         print("item added in static_sections")
    
    
    # print(formated_template_data)
    
    # return HttpResponse('Invalid processed prompt format')

    
    
    # # Initialize the formatted data structure with 'one' and 'two' keys
    # formated_template_data = {'one': [], 'two': []}
    
    # if not is_valid_processed_prompt(processed_prompt.items()):
    #         return HttpResponse('Invalid processed prompt format.', status=400)

    # # Iterate over each section in the processed prompt
    # for section_key, section_value in processed_prompt.items():
    #     # Check if the current section's target is in one_targets or two_targets
    #     if section_value['target'] in one_targets:
    #         formated_template_data['one'].append(section_value)
    #         print("item added in one")
    #     elif section_value['target'] in two_targets:
    #         formated_template_data['two'].append(section_value)
    #         print("item added in two")

    # Now formated_template_data should have the items categorized into 'one' and 'two'

    
    
    
    # for section_key, section_value in processed_prompt.items():
    #     for item in section_value['data']:
    #         if item['target'] in one_targets:
    #             formated_template_data['one'].append(item)
    #             print("item added in one")
    #         elif item['target'] in two_targets:
    #             formated_template_data['two'].append(item)
    #             print("item added in two")
    #         elif item['target'] in static_targets: 
    #             formated_template_data['static_sections'].append(item)
    #             print("item added in static_sections")
    
#     response_data = {
#         'formated_template_data': formated_template_data
#     }

#     return JsonResponse(response_data)
    
    
    
    
    
#     res = OrderFinalizedData.objects.get(id=25)
#     processed_prompt = res.finalized_data
    
#     order_id = 71
    
#     try:
#         order_initial_data = OrderInitialData.objects.get(order__id=order_id)  # Fetch the OrderInitialData instance for the given order_id
#     except OrderInitialData.DoesNotExist:
#         return HttpResponse('OrderInitialData not found.')

#     if order_initial_data.template_variation_selected:
#         # Variation is selected, fetch its variation_types
#         variation = order_initial_data.template_variation_selected
#         variation_types = variation.variation_types
#         return HttpResponse(f'Variation selected: {variation.variation_name}, Variation Types: {variation_types}')
#     else:
#         # If no variation is selected, fetch the default variation's variation_types
#         default_variation_instance = DefaultVariation.objects.first()  # Fetch the DefaultVariation instance
#         if default_variation_instance:
#             default_variation = default_variation_instance.variation
#             variation_types = default_variation.variation_types
#             return HttpResponse(f'Default Variation selected: {default_variation.variation_name}, Variation Types: {variation_types["one_targets"]}')
#         else:
#             set_default_variation(variation_id = 8)
#             return HttpResponse('No default variation found.')
    
   
   
   
   
# def is_valid_processed_prompt(processed_prompt):
#     # Define the expected keys in the processed_prompt
#     expected_keys = {'personalinfo', 'education', 'achievements', 'softSkill', 'languages', 'hobbies', 'experience', 'certificates', 'skills'}
    
#     # Check if all expected keys are present in the processed_prompt
#     if not all(key in processed_prompt for key in expected_keys):
#         return False

#     # Additional checks can be added here, such as structure of each section

#     return True


  
# def set_default_variation(variation_id):
#     try:
#         with transaction.atomic():  # Use a transaction to ensure data integrity
#             # Retrieve the variation you want to set as default
#             variation = Variation.objects.get(id=variation_id)
            
#             # Check if a default variation already exists
#             if DefaultVariation.objects.exists():
#                 # Update the existing default variation
#                 default_variation = DefaultVariation.objects.first()
#                 default_variation.variation = variation
#             else:
#                 # Create a new default variation if it doesn't exist
#                 default_variation = DefaultVariation(variation=variation)
            
#             default_variation.save()
#             return True, "Default variation set successfully."
#     except Variation.DoesNotExist:
#         return False, "Variation does not exist."
#     except Exception as e:
#         return False, str(e)
    
    
    
    
#     formated_template_data = {
#     'one': [],
#     'two': []
#     }
#     one_targets = ['education', 'achievements', 'softSkill', 'languages', 'hobbies', 'references']
#     two_targets = ['experience', 'certificates', 'skills']
#     # Iterate through the original data and distribute items to the new structure
#     for item in processed_prompt['data']:
#         if item['target'] in one_targets:
#             formated_template_data['one'].append(item)
#         elif item['target'] in two_targets:
#             formated_template_data['two'].append(item)
    
    
#     print(formated_template_data)
    
#     return HttpResponse(formated_template_data)






