from .models import ChatPrompt 
from orders.models import OrderParse
import json
import re
import openai
import os
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def process_prompt(order_id, prompt_id=None, prompt_text=None):
    # Fetch the OrderParse instance using order_id
    order_parse = OrderParse.objects.get(order__id=order_id)

    # Decide whether to use prompt_id to fetch the prompt template from the database or use the provided prompt_text
    if prompt_id:
        prompt = ChatPrompt.objects.get(id=prompt_id).template
    elif prompt_text:
        prompt = prompt_text
    else:
        raise ValueError("Either 'prompt_id' or 'prompt_text' must be provided.")
    # Process the prompt to replace tags with actual data
    processed_prompt = extract_and_replace_tags_in_prompt(prompt, order_parse)
    print(processed_prompt)
    return generate_response_with_openai(processed_prompt)


def generate_response_with_openai(processed_prompt):
    client = openai.OpenAI(api_key=OPENAI_API_KEY)
    message =[
        {"role": "system", "content": "You are data analyser."},
        {"role": "user", "content": processed_prompt}
        ]
    chat_completion = client.chat.completions.create(
        messages= message,
        model="gpt-3.5-turbo",
        temperature = 0,
    )
    return chat_completion.choices[0].message.content

def extract_and_replace_tags_in_prompt(prompt, order_parse):
    # Regex to match your tag format, assuming tags are like @tagname
    tags = re.findall(r'@\w+', prompt)

    for tag in tags:
        handler = tag_handlers.get(tag)
        if handler:
            data = handler(order_parse)
            prompt = prompt.replace(tag, data)

    return prompt



def handle_raw_resume_text(order_parse):
    return order_parse.pdf_to_text_data

def handle_education(order_parse):
    education_data = order_parse.parsed_data.get('education', [])
    # Format the education data as needed, this is a placeholder implementation
    formatted_education = "\n".join([f"{edu['degree']} at {edu['institution']}" for edu in education_data])
    return formatted_education

def handle_softskills(order_parse):
    soft_skills = order_parse.parsed_data.get('soft_skills', [])
    # Format the soft skills data, this is a placeholder implementation
    formatted_softskills = ", ".join(soft_skills)
    return formatted_softskills

tag_handlers = {
    '@raw_resume_text': handle_raw_resume_text,
    '@education': handle_education,
    '@softskills': handle_softskills,
    # Add mappings for other tags and their handlers
}
