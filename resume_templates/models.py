from django.db import models
# from django.contrib.postgres.fields import JSONField

from django.db.models import JSONField  # This is compatible with SQLite in Django >= 3.1


class Template(models.Model):
    name = models.CharField(max_length=100)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Variation(models.Model):
    template = models.ForeignKey(Template, related_name='variations', on_delete=models.CASCADE)
    variation_name = models.CharField(max_length=100)
    thumbnail = models.ImageField(upload_to='variations_thumbnails/', blank=True, null=True)
    file = models.FileField(upload_to='template_files/')
    created_at = models.DateTimeField(auto_now_add=True)
    variation_types = JSONField(default=dict)  # Use default=dict to ensure the field is initialized with an empty dictionary
    is_default_variation = models.BooleanField(default=False)  # New field to indicate if this is the default variation 

    def __str__(self):
        return f"{self.template.name} - {self.variation_name}"
    
    def save(self, *args, **kwargs):
        if self.is_default_variation:
            # Set all other variations of this template to not be the default
            Variation.objects.filter(template=self.template).update(is_default_variation=False)
        super(Variation, self).save(*args, **kwargs)
