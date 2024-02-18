from django.db import models

# Create your models here.




class ActivityTag(models.Model):
    tag = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.tag

class Department(models.Model):
    name = models.CharField(max_length=100)
    activities = models.ManyToManyField(ActivityTag, related_name='departments')

    def __str__(self):
        return self.name






# SalesMarketing pge models
class Contact(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    STATUS_CHOICES = [
        ('interested', 'Interested'),
        ('not_interested', 'Not Interested'),
    ]
    status = models.CharField(max_length=15, choices=STATUS_CHOICES)
    PAYMENT_STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('pending', 'Pending'),
    ]
    payment_status = models.CharField(max_length=15, choices=PAYMENT_STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email}"


class PreliminaryData(models.Model):
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='preliminary_data')
    requirements = models.TextField()
    TEMPLATE_CHOICES = [
        ('none', 'None'),
        ('temp1', 'Template 1'),
        ('temp2', 'Template 2'),
    ]
    template_selection = models.CharField(max_length=10, choices=TEMPLATE_CHOICES, default='none')
    # old_cv = models.FileField(upload_to='old_cvs/', blank=True, null=True)
    # other_files = models.FileField(upload_to='other_files/', blank=True, null=True)

    ORDER_TYPE_CHOICES = [
        ('new_order', 'New Order'),
        ('modification', 'Modification'),
    ]
    order_type = models.CharField(max_length=20, choices=ORDER_TYPE_CHOICES, default='new_order')

    def __str__(self):
        return f"Preliminary Data for {self.contact}"

class PreliminaryDataFile(models.Model):
    FILE_TYPES = (
        ('original_cv', ' Original CV'),
        ('original_pic', 'original_pic'),
        ('other', 'Other File'),
    )
    preliminary_data = models.ForeignKey(PreliminaryData, related_name='files', on_delete=models.CASCADE)
    file = models.FileField(upload_to='preliminary_files/')
    file_type = models.CharField(max_length=20, choices=FILE_TYPES)

    def __str__(self):
        return f"{self.get_file_type_display()} for {self.preliminary_data.contact.email}"
