from celery import shared_task
from orders.models import Order, OrderInitialFiles, OrderParse

@shared_task
def parse_order_originalcv(order_id):
    order = Order.objects.get(id=order_id)
    cv_files = OrderInitialFiles.objects.filter(order=order, file_type='original_cv')

    if cv_files.exists():
        cv_file = cv_files.first()  # Assuming one CV per order; adjust logic if multiple CVs are possible
        # Implement your CV parsing logic here, possibly setting parse_status to 'processing'
        try:
            parsed_data =  {{
            "name": "Mustehsen",
            "PersonalInfo": {{
                "Phone": "+971555555",
                "Email": "engrmustehsen@gmail.com",
                "Nationality": "Pakistani",
                "VisaType": "Employment",
                "DOB": "July-1995",
                "DrivingLicense": "UAE"
            }},
            "Educations": [
                {{
                    "University": "University of Engineering & technology",
                    "DegreeName": "Mechatronics & Control Engineering",
                    "Location": "Lahore",
                    "Date": "2012-2016"
                }}
            ],
            "JobHeadings": [
                {{
                    "CompanyName": "Company 1",
                    "Position": "MEP engineer",
                    "Date": "2016",
                    "Location": "Dubai"
                }}
            ],
            "YearsOfExperience": "6 Years",
            "Language": "English,Urdu",
            "Hobbies": "Playing, reading,"
        }}  # Replace with actual parsing result
            # Save parsed data to OrderParse model
            OrderParse.objects.create(
                order=order,
                parsed_data=parsed_data,
                parse_status='completed'
            )
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