# Generated by Django 5.0.2 on 2024-02-10 09:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0001_initial'),
        ('profiles', '0004_remove_customuser_is_staff_member'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='department',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='users', to='dashboard.department'),
        ),
        migrations.DeleteModel(
            name='Department',
        ),
    ]