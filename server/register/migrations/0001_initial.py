# Generated by Django 4.2.1 on 2023-07-04 02:04

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role_name', models.CharField(max_length=20, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nam_reg', models.CharField(default=None, max_length=200)),
                ('eml_reg', models.CharField(default=None, max_length=200, unique=True)),
                ('cell_reg', models.CharField(default=None, max_length=30)),
                ('pwd_reg', models.CharField(default=None, max_length=80)),
                ('fec_reg', models.DateTimeField(default=django.utils.timezone.now)),
                ('del_reg', models.IntegerField(default=1)),
                ('rol_reg', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='register.role')),
            ],
        ),
    ]
