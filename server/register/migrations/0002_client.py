# Generated by Django 4.2.1 on 2023-07-06 04:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('register', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ced_cli', models.CharField(max_length=20)),
                ('add_cli', models.TextField()),
                ('sta_cli', models.CharField(max_length=50)),
                ('cit_cli', models.CharField(max_length=50)),
                ('zip_cli', models.CharField(max_length=10)),
                ('id_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='register.user')),
            ],
        ),
    ]
