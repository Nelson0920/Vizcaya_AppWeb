# Generated by Django 4.2.2 on 2023-07-10 02:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='nom_com',
            field=models.CharField(default=None, max_length=200),
        ),
    ]
