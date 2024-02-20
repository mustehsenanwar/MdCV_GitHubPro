from django.db import models

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

    def __str__(self):
        return f"{self.template.name} - {self.variation_name}"
