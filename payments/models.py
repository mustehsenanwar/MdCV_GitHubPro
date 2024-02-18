from django.db import models
from orders.models import Order  # Import the Order model from OrderProcessingApp
from profiles.models import CustomUser  # Import the CustomUser model from your profiles app

class Payment(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')  # Link to Order
    buyer = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='payments')  # Link to Buyer
    amount = models.DecimalField(max_digits=10, decimal_places=2)  # Payment amount
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')])  # Payment status
    transaction_id = models.CharField(max_length=100, unique=False)  # Unique transaction ID for reference
    payment_method = models.CharField(max_length=50)  # Payment method (e.g., PayPal, Credit Card)
    timestamp = models.DateTimeField(auto_now_add=True)  # Timestamp of the transaction

    def __str__(self):
        return f"Payment {self.transaction_id} for Order {self.order.id}"
