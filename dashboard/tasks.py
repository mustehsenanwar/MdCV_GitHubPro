from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from celery import shared_task
from orders.models import Order, OrderInitialFiles, OrderParse,OrderFinalizedData

from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
import fitz  # PyMuPDF
import openai
import json

@shared_task
def parse_order_originalcv(order_id):
    order = Order.objects.get(id=order_id)
    cv_files = OrderInitialFiles.objects.filter(order=order, file_type='original_cv')
    # parsed_data = pdfparser(cv_files)

    if cv_files.exists():
        cv_file = cv_files.first()
        cv_file_path = cv_file.file.path
        parsed_data = pdfparser(cv_file_path)
        try:
            with transaction.atomic():
                OrderParse.objects.create(
                    order=order,
                    parsed_data=parsed_data,
                    parse_status='completed'
                )
                # Try to fetch existing OrderFinalizedData, if not exist then create new
                try:
                    order_finalized_data = OrderFinalizedData.objects.get(order=order)
                    order_finalized_data.finalized_data = parsed_data  # Update existing data
                except ObjectDoesNotExist:
                    order_finalized_data = OrderFinalizedData.objects.create(
                        order=order,
                        finalized_data=parsed_data,
                        status='draft'  # Assuming the data is initially in draft
                    )
                order_finalized_data.save() 
        except Exception as e:
            # Handle parsing failure, possibly setting parse_status to 'failed'
            OrderParse.objects.create(
                order=order,
                parse_status='failed'
            )
    else:
        # Handle case where no CV is provided, possibly setting parse_status to 'no_cv'
        OrderParse.objects.create(
            order=order,
            parse_status='no_cv'
        )














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
        context = response_from_openai
        return context