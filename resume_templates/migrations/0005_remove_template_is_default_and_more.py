# Generated by Django 5.0.2 on 2024-03-11 20:47

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("resume_templates", "0004_variation_is_default_variation_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="template",
            name="is_default",
        ),
        migrations.RemoveField(
            model_name="variation",
            name="is_default_variation",
        ),
        migrations.CreateModel(
            name="DefaultVariation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "variation",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="default_for_categories",
                        to="resume_templates.variation",
                    ),
                ),
            ],
        ),
    ]
