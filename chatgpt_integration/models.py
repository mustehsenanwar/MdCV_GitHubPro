from django.db import models

class PromptCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
    
    @property
    def default_prompt(self):
        return self.prompts.filter(is_default=True).first()

class ChatPrompt(models.Model):
    category = models.ForeignKey(PromptCategory, related_name='prompts', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    template = models.TextField(help_text="Template for the ChatGPT prompt")
    description = models.TextField(blank=True, null=True)
    is_default = models.BooleanField(default=False, help_text="Mark as default prompt for the category")


    def __str__(self):
        return f"{self.name} - {self.category.name}"
