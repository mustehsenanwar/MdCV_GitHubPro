from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
import fitz  # PyMuPDF
import openai
import json


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
            "VisaType": "[Extract the visa type, if mentioned]",
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
        temperature = 0,
    )
    return chat_completion.choices[0].message.content

def extract_text_from_pdf(file_path):
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def pdfparser(request):
    if request.method == 'POST':
        uploaded_file = request.FILES.get('pdfFile')
        if uploaded_file:
            fs = FileSystemStorage()
            name = fs.save(uploaded_file.name, uploaded_file)
            file_path = fs.path(name)  # Get the full path to the saved file
            resume_text = extract_text_from_pdf(file_path)

            response_from_openai = generate_response_with_openai(resume_text)  # Use the extracted text as a prompt
            print(response_from_openai)
            response_from_openai = json.loads(response_from_openai)
            context = {'response': response_from_openai,
                       'original_cv_text' : resume_text}
            return render(request, 'fileparser/pdfparser.html', context=context)
    # For GET requests or if there's no uploaded file in the POST request
    return render(request, 'fileparser/pdfparser.html')
