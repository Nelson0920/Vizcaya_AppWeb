# Generated by Django 4.2.2 on 2023-07-23 23:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0007_productaudit_orderaudit'),
    ]

    operations = [
        migrations.DeleteModel(
            name='OrderAudit',
        ),
    ]
