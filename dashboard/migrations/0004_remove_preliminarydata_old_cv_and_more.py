# Generated by Django 5.0.2 on 2024-02-13 10:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0003_contact_preliminarydata'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='preliminarydata',
            name='old_cv',
        ),
        migrations.RemoveField(
            model_name='preliminarydata',
            name='other_files',
        ),
        migrations.CreateModel(
            name='PreliminaryDataFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='preliminary_files/')),
                ('file_type', models.CharField(choices=[('original_cv', ' Original CV'), ('original_pic', 'original_pic'), ('other', 'Other File')], max_length=20)),
                ('preliminary_data', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='files', to='dashboard.preliminarydata')),
            ],
        ),
    ]