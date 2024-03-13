# Generated by Django 5.0.2 on 2024-03-11 14:13

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("resume_templates", "0003_rename_templatevariation_variation"),
    ]

    operations = [
        migrations.AddField(
            model_name="variation",
            name="is_default_variation",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="variation",
            name="variation_types",
            field=models.JSONField(default=dict),
        ),
    ]