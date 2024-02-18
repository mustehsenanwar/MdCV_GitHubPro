from django.db import models
from profiles.models import CustomUser  # Ensure the CustomUser model is imported correctly

class Order(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='orders')
    requirements = models.TextField()
    template_selected = models.CharField(max_length=10)
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


class OrderFiles(models.Model):
    FILE_TYPES = (
        ('original_cv', ' Original CV'),
        ('original_pic', 'original_pic'),
        ('other', 'Other File'),
    )
    order = models.ForeignKey(Order, related_name='files', on_delete=models.CASCADE)
    file = models.FileField(upload_to='order_files/')
    file_type = models.CharField(max_length=20, choices=FILE_TYPES)

    def __str__(self):
        return f"{self.get_file_type_display()} for Order {self.order.id}"