from celery import shared_task
import time

@shared_task
def parse_cv(cv_path):
    # Your logic to parse the CV using GPT API or other methods
    time.sleep(20)
    pass
