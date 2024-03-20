# Generated by Django 5.0.2 on 2024-03-20 04:36

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("orders", "0010_orderfinalizeddata_pdf_to_text_data_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="orderfinalizeddata",
            name="qr_code_image",
            field=models.ImageField(
                blank=True,
                help_text="Upload the QR code image.",
                null=True,
                upload_to="qr_codes/",
                validators=[
                    django.core.validators.FileExtensionValidator(
                        allowed_extensions=["jpg", "jpeg", "png"]
                    )
                ],
            ),
        ),
        migrations.AddField(
            model_name="orderfinalizeddata",
            name="resume_picture",
            field=models.ImageField(
                blank=True,
                help_text="Upload the resume picture.",
                null=True,
                upload_to="resume_pictures/",
                validators=[
                    django.core.validators.FileExtensionValidator(
                        allowed_extensions=["jpg", "jpeg", "png"]
                    )
                ],
            ),
        ),
    ]
