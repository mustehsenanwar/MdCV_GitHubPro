from django.db import models
from profiles.models import CustomUser  # Ensure the CustomUser model is imported correctly
from resume_templates.models import  Variation



class Order(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='orders')
    order_status = models.CharField(max_length=20, default='pending', choices=[
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.pk} for {self.user.email}"

class OrderInitialData(models.Model):
    order = models.ForeignKey(Order, related_name='initial_data', on_delete=models.CASCADE)  # Changed related_name to 'initial_data'
    requirements = models.TextField()
    template_variation_selected = models.ForeignKey(Variation, related_name='order_initial_data',on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        # Corrected the reference to the variation name
        return f"Initial Data for Order {self.order.id} - {self.template_variation_selected.variation_name if self.template_variation_selected else 'No Variation Selected'}"
class OrderInitialFiles(models.Model):
    FILE_TYPES = (
        ('original_cv', 'Original CV'),
        ('original_pic', 'Original Picture'),
        ('other', 'Other File'),
    )
    order = models.ForeignKey(Order, related_name='initial_files', on_delete=models.CASCADE)  # Updated related_name to 'initial_files'
    file = models.FileField(upload_to='order_initial_files/')  # Updated upload_to path for clarity
    file_type = models.CharField(max_length=20, choices=FILE_TYPES)

    def __str__(self):
        return f"{self.get_file_type_display()} for Order {self.order.id}"

from django.db import models

class OrderParse(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_parse')
    parsed_data = models.JSONField(default=dict, blank=True, help_text='Stores the parsed CV data as JSON.')
    parse_status = models.CharField(max_length=20, default='pending', choices=[
        ('pending', 'Pending'),  # Parsing has not been initiated yet
        ('processing', 'Processing'),  # Parsing is in progress
        ('completed', 'Completed'),  # Parsing is completed
        ('no_cv', 'No CV'),  # No CV was provided for parsing
        ('failed', 'Failed')  # Parsing attempted but failed
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Parsed Data for Order {self.order.id}"


class OrderFinalizedData(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='finalized_data')
    finalized_data = models.JSONField(default=dict, blank=True, help_text='Stores the finalized CV data as JSON.')
    status = models.CharField(max_length=20, default='draft', choices=[
        ('draft', 'Draft'),  # Data is still being edited
        ('review', 'Review'),  # Data is under review
        ('finalized', 'Finalized'),  # Data editing is completed and finalized
    ])
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Finalized Data for Order {self.order.id}"