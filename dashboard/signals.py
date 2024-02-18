from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import F
from dashboard.models import Contact, PreliminaryData
from profiles.models import CustomUser
from orders.models import Order,OrderFiles
from payments.models import Payment
from django.contrib.auth.hashers import make_password
from django.utils.crypto import get_random_string
from django.db import transaction


@receiver(post_save, sender=Contact)
def handle_payment_confirmation(sender, instance, **kwargs):
    if instance.payment_status == 'confirmed':
        with transaction.atomic():
            # Generate a random password
            random_password = get_random_string(length=10)
            # Migrate Contact to CustomUser (create or update)
            user, user_created = CustomUser.objects.update_or_create(
                email=instance.email,
                defaults={
                    'phone': instance.phone,
                    'password': make_password(random_password),
                    'first_name': instance.first_name,
                    'last_name': instance.last_name,
                    # Set additional fields as needed
                }
            )

            # If the user is newly created, send them their credentials
            if user_created:
                # Here, integrate with your communication system to send the credentials
                pass  # Replace this with your actual sending logic

            # Migrate PreliminaryData to Order
            # related_prelim_data = PreliminaryData.objects.filter(contact=instance)
            for prelim_data in instance.preliminary_data.all():
            # for prelim_data in related_prelim_data:
                order = Order.objects.create(
                    user=user,
                    requirements=prelim_data.requirements,
                    template_selected=prelim_data.template_selection,
                    # Include other fields as necessary
                )
                for prelim_file in prelim_data.files.all():
                    OrderFiles.objects.create(
                        order=order,
                        file=prelim_file.file,
                        file_type=prelim_file.file_type,
                    )


                # Create a Payment record for this order
                Payment.objects.create(
                    order=order,
                    buyer=user,
                    amount=0,  # Set the actual amount
                    status='completed',  # Assuming payment is completed
                    transaction_id='Your_Transaction_ID',  # Set the actual transaction ID
                    payment_method='Your_Payment_Method',  # Set the actual payment method
                )

            # Clean-up: Delete the Contact and associated PreliminaryData
            instance.preliminary_data.all().delete()
            instance.delete()
