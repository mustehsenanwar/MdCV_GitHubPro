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

def parse_order_originalcv(request):
    order_id = 38
    order = Order.objects.get(id=order_id)
    cv_files_queryset = OrderInitialFiles.objects.filter(order=order, file_type='original_cv')

    if cv_files_queryset.exists():  # Check if the queryset is not empty
        cv_file = cv_files_queryset.first()  # Get the first object from the queryset
        cv_file_path = cv_file.file.path  # Access the 'file' attribute and then get its full filesystem path
        parsed_data = pdfparser(cv_file_path)  # Now you pass the file path to your parsing function
        return HttpResponse(parsed_data)
    else:
        # Handle the case where no CV file is associated with the order
        print("No original CV file found for this order.")






def construct_messages(resume_text):
    prompt = f"""
    Given the following resume text, extract the relevant information and fill in the structured format provided.

    Resume Text:
    {resume_text}

    Please fill in the following structured format based on the resume and if value not found place null:
    {{
        "name": "[Extract the full name from the resume]",
        "PersonalInfo": {{
            "Phone": "[Extract the phone number and write it in international format e.g +97155555555]",
            "Email": "[Extract the email address]",
            "Nationality": "[Extract the nationality]",
            "VisaType": "[Extract the visa type, if mentioned, e.g visit visa , employment visa, resident visa ]",
            "DOB": "[Extract the date of birth only month and year needed]",
            "DrivingLicense": "[Indicate if a driving license is mentioned]"
        }},
        "Educations": [
            {{
                "University": "[Extract the name of the university or institution]",
                "DegreeName": "[Extract the degree or qualification]",
                "Location": "[Extract the location of the university or institution]",
                "Date": "[Extract the date or duration of the each education]"
            }}
        ],
        "JobHeadings": [
            {{
                "CompanyName": "[Extract the company name]",
                "Position": "[Extract the job title or position]",
                "Date": "[Extract the date or duration of the employment]",
                "Location": "[Extract the location of the job]"
            }}
        ],
        "YearsOfExperience": "[Extract or estimate the total years of experience]",
        "Language": "[List the languages mentioned]",
        "Hobbies": "[List any hobbies mentioned]"
    }}
    """
    return [
        {"role": "system", "content": "You are data analyser."},
        {"role": "user", "content": prompt}
    ]
def generate_response_with_openai(resume_text):
    client = openai.OpenAI(api_key="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")
    message = construct_messages(resume_text)
    chat_completion = client.chat.completions.create(
        messages= message,
        model="gpt-4",
        temperature = 0.4,
    )
    return chat_completion.choices[0].message.content

def extract_text_from_pdf(file_path):
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def pdfparser(cv_files):
    if cv_files:
        print(cv_files)
        file_path = cv_files
        resume_text = extract_text_from_pdf(file_path)

        response_from_openai = generate_response_with_openai(resume_text)  # Use the extracted text as a prompt
        print(response_from_openai)
        response_from_openai = json.loads(response_from_openai)
        context = {'response': response_from_openai,'original_cv_text' : resume_text}
        return context


 


def example_page(request):
    res = OrderFinalizedData.objects.get(id=25)
    processed_prompt = res.finalized_data
    
    order_id = 71
    
    try:
        order_initial_data = OrderInitialData.objects.get(order__id=order_id)  # Fetch the OrderInitialData instance for the given order_id
    except OrderInitialData.DoesNotExist:
        return HttpResponse('OrderInitialData not found.')

    if order_initial_data.template_variation_selected:
        # Variation is selected, fetch its variation_types
        variation = order_initial_data.template_variation_selected
        variation_types = variation.variation_types
        return HttpResponse(f'Variation selected: {variation.variation_name}, Variation Types: {variation_types}')
    else:
        # If no variation is selected, fetch the default variation's variation_types
        default_variation_instance = DefaultVariation.objects.first()  # Fetch the DefaultVariation instance
        if default_variation_instance:
            default_variation = default_variation_instance.variation
            variation_types = default_variation.variation_types
            return HttpResponse(f'Default Variation selected: {default_variation.variation_name}, Variation Types: {variation_types["one_targets"]}')
        else:
            set_default_variation(variation_id = 8)
            return HttpResponse('No default variation found.')
    
    
def set_default_variation(variation_id):
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
    
    
    
    
    formated_template_data = {
    'one': [],
    'two': []
    }
    one_targets = ['education', 'achievements', 'softSkill', 'languages', 'hobbies', 'references']
    two_targets = ['experience', 'certificates', 'skills']
    # Iterate through the original data and distribute items to the new structure
    for item in processed_prompt['data']:
        if item['target'] in one_targets:
            formated_template_data['one'].append(item)
        elif item['target'] in two_targets:
            formated_template_data['two'].append(item)
    
    
    print(formated_template_data)
    
    return HttpResponse(formated_template_data)