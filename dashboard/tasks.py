from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from celery import shared_task
from orders.models import Order, OrderInitialFiles, OrderParse,OrderFinalizedData,OrderInitialData
from resume_templates.models import DefaultVariation     

from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
import fitz  # PyMuPDF
import openai
import json
from chatgpt_integration.utils import process_prompt
from chatgpt_integration.models import PromptCategory
import json


@shared_task
def parse_order_originalcv(order_id):
    try:
        print(order_id)
        print("taks taks")
        order = Order.objects.get(id=order_id)
        cv_files = OrderInitialFiles.objects.filter(order=order, file_type='original_cv')

        if cv_files.exists():
            cv_file = cv_files.first()
            pdf_to_text_data = pdfparser(cv_file.file.path)  # Convert PDF to text
            print(pdf_to_text_data)
            with transaction.atomic():
                # Create or update OrderParse with pdf_to_text_data
                order_parse, _ = OrderParse.objects.update_or_create(
                    order=order,
                    defaults={'pdf_to_text_data': pdf_to_text_data, 'parse_status': 'completed'}
                )

                # Fetch the default prompt ID for 'pdf parser' category
                try:
                    pdf_parser_category = PromptCategory.objects.get(name='pdf parser')
                    default_prompt = pdf_parser_category.default_prompt
                    if default_prompt:
                        prompt_id = default_prompt.id
                        # Process the prompt to generate processed_prompt after pdf_to_text_data is saved
                        processed_prompt = process_prompt(order_id=order_id, prompt_id=prompt_id)
                        # Update OrderParse with processed_prompt
                        order_parse.parsed_data = processed_prompt
                        order_parse.save()

                        formated_template_data = {'static_sections' : [], 'one': [],'two': []}
                        
                        print(processed_prompt)
                        
                        try:
                            order_initial_data = OrderInitialData.objects.get(order__id=order_id)  # Fetch the OrderInitialData instance for the given order_id
                        except OrderInitialData.DoesNotExist:
                            return HttpResponse('OrderInitialData not found.')

                        if order_initial_data.template_variation_selected:
                            # Variation is selected, fetch its settings from VariationSetting
                            variation = order_initial_data.template_variation_selected
                            variation_setting = variation.settings  # Assuming 'settings' is the related_name for VariationSetting
                            settings = variation_setting.settings  # Access the JSON field 'settings' in VariationSetting
                            print("Already selected template selections")
                        else:
                            # If no variation is selected, fetch the default variation's settings
                            default_variation_instance = DefaultVariation.objects.first()  # Fetch the DefaultVariation instance
                            if default_variation_instance:
                                print("Default variation selected")
                                default_variation = default_variation_instance.variation
                                default_variation_setting = default_variation.settings  # Access the related VariationSetting
                                settings = default_variation_setting.settings  # Access the JSON field 'settings'
                                print(f"Default Variation selected: {default_variation.variation_name}")
                            else:
                                # If there's no default variation found, you can handle it as per your application's logic
                                # For example, setting a default variation if needed or returning a meaningful response
                                return HttpResponse('No default variation found.')

                        # Extracting specific settings from the JSON structure
                        # Ensure your JSON structure in VariationSetting includes these keys
                        one_targets = settings.get('layout', {}).get('one_targets', [])
                        two_targets = settings.get('layout', {}).get('two_targets', [])
                        static_targets = settings.get('layout', {}).get('static_targets', [])

                        
                        print(static_targets)
                        print("loop started")
                        # Iterate through the original data and distribute items to the new structure
                        # for item in processed_prompt['data']:
                        #     if item['target'] in one_targets:
                        #         formated_template_data['one'].append(item)
                        #         print("item added in one ")
                        #     elif item['target'] in two_targets:
                        #         print("item added in two")
                        #         formated_template_data['two'].append(item)
                        
                        
                        for section_key, section_value in processed_prompt.items():
                            # Check if the current section's target is in one_targets or two_targets
                            if section_value['target'] in one_targets:
                                formated_template_data['one'].append(section_value)
                                print("item added in one")
                            elif section_value['target'] in two_targets:
                                formated_template_data['two'].append(section_value)
                                print("item added in two")
                            elif section_value['target'] in static_targets:
                                formated_template_data['static_sections'].append(section_value)
                                print("item added in static_sections")
                        
                        
                        print(formated_template_data)
                        
                        # Update or create OrderFinalizedData with processed_prompt
                        order_finalized_data, _ = OrderFinalizedData.objects.update_or_create(
                            order=order,
                            defaults={
                                'pdf_to_text_data': pdf_to_text_data,  # Include pdf_to_text_data
                                'finalized_data': formated_template_data,  # Include processed_prompt
                                'status': 'draft'
                            }
                        )
                    else:
                        # Handle case where no default prompt is found
                        # You can log an error or set a default value for prompt_id
                        pass
                except PromptCategory.DoesNotExist:
                    # Handle case where 'pdf parser' category does not exist
                    # You can log an error or set a default value for prompt_id
                    pass

    except ObjectDoesNotExist:
        # Handle the case where the order or CV files do not exist
        OrderParse.objects.create(order=order, parse_status='no_cv')
    except Exception as e:
        # Handle general exceptions, possibly setting parse_status to 'failed'
        OrderParse.objects.create(order=order, parse_status='failed')



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

        # response_from_openai = generate_response_with_openai(resume_text) 
        # print(response_from_openai)
        # response_from_openai = json.loads(response_from_openai)
        # context = response_from_openai
        # return context
        
        
        return resume_text