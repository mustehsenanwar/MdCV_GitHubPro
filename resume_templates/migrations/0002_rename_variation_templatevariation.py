# Generated by Django 5.0.2 on 2024-02-21 21:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0005_remove_orderinitialdata_template_selected_and_more'),
        ('resume_templates', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Variation',
            new_name='TemplateVariation',
        ),
    ]