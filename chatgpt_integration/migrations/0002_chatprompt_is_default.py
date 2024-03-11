# Generated by Django 5.0.2 on 2024-03-10 20:41

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("chatgpt_integration", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="chatprompt",
            name="is_default",
            field=models.BooleanField(
                default=False, help_text="Mark as default prompt for the category"
            ),
        ),
    ]
