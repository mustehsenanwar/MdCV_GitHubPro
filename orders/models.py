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

