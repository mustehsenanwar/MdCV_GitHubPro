# Generated by Django 5.0.2 on 2024-02-21 13:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0003_remove_order_old_cv_orderfiles'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='requirements',
        ),
        migrations.RemoveField(
            model_name='order',
            name='template_selected',
        ),
        migrations.CreateModel(
            name='OrderInitialData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('requirements', models.TextField()),
                ('template_selected', models.CharField(max_length=10)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='initial_data', to='orders.order')),
            ],
        ),
        migrations.CreateModel(
            name='OrderInitialFiles',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='order_initial_files/')),
                ('file_type', models.CharField(choices=[('original_cv', 'Original CV'), ('original_pic', 'Original Picture'), ('other', 'Other File')], max_length=20)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='initial_files', to='orders.order')),
            ],
        ),
        migrations.DeleteModel(
            name='OrderFiles',
        ),
    ]
