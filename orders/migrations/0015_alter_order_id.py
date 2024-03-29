# Generated by Django 5.0.2 on 2024-03-25 10:33

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("orders", "0014_alter_order_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="order",
            name="id",
            field=models.UUIDField(
                default=uuid.uuid4, editable=False, primary_key=True, serialize=False
            ),
        ),
    ]
