# Generated by Django 5.0.2 on 2024-02-09 11:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0002_department_customuser_department'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='is_staff_member',
            field=models.BooleanField(default=False),
        ),
    ]