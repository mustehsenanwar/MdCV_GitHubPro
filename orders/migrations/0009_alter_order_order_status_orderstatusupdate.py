# Generated by Django 5.0.2 on 2024-02-29 16:20

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0008_orderfinalizeddata'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='order_status',
            field=models.CharField(choices=[('pending', 'Pending'), ('processing', 'Processing'), ('review', 'Review'), ('revision', 'Revision Needed'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='pending', max_length=20),
        ),
        migrations.CreateModel(
            name='OrderStatusUpdate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('previous_status', models.CharField(choices=[('pending', 'Pending'), ('processing', 'Processing'), ('review', 'Review'), ('revision', 'Revision Needed'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], max_length=20)),
                ('current_status', models.CharField(choices=[('pending', 'Pending'), ('processing', 'Processing'), ('review', 'Review'), ('revision', 'Revision Needed'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], max_length=20)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='status_updates', to='orders.order')),
                ('updated_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order_updates', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]