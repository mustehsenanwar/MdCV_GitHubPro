from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from celery import shared_task
from orders.models import Order, OrderInitialFiles, OrderParse,OrderFinalizedData

@shared_task
def parse_order_originalcv(order_id):
    order = Order.objects.get(id=order_id)
    cv_files = OrderInitialFiles.objects.filter(order=order, file_type='original_cv')

    if cv_files.exists():
        cv_file = cv_files.first()  # Assuming one CV per order; adjust logic if multiple CVs are possible
        # Implement your CV parsing logic here, possibly setting parse_status to 'processing'
        try:
            with transaction.atomic():
                parsed_data = {"name": "Sohailakbar"} 
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