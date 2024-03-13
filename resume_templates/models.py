from django.db import models
# from django.contrib.postgres.fields import JSONField

from django.db.models import JSONField  # This is compatible with SQLite in Django >= 3.1


class Template(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Variation(models.Model):
    template = models.ForeignKey(Template, related_name='variations', on_delete=models.CASCADE)
    variation_name = models.CharField(max_length=100)
    thumbnail = models.ImageField(upload_to='variations_thumbnails/', blank=True, null=True)
    file = models.FileField(upload_to='template_files/')
    created_at = models.DateTimeField(auto_now_add=True)
    variation_types = JSONField(default=dict)

    def __str__(self):
        return f"{self.template.name} - {self.variation_name}"
    
class DefaultVariation(models.Model):
    variation = models.OneToOneField(Variation, related_name='default_for_categories', on_delete=models.CASCADE)

    def __str__(self):
        return f"Default Variation: {self.variation.variation_name}"

    def save(self, *args, **kwargs):
        # Ensure there's only one DefaultVariation instance
        if DefaultVariation.objects.exists() and not self.pk:
            raise Exception('There can only be one DefaultVariation instance.')
        return super(DefaultVariation, self).save(*args, **kwargs)

