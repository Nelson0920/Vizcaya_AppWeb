# Generated by Django 4.2.2 on 2023-07-13 23:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('register', '0002_client'),
    ]

    operations = [
        migrations.CreateModel(
            name='Module',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_count', models.IntegerField(default=0)),
                ('comment_count', models.IntegerField(default=0)),
                ('role_count', models.IntegerField(default=0)),
                ('user_count', models.IntegerField(default=0)),
                ('client_count', models.IntegerField(default=0)),
            ],
        ),
        migrations.RemoveField(
            model_name='user',
            name='rol_reg',
        ),
        migrations.AddField(
            model_name='user',
            name='role',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='users', to='register.role'),
        ),
        migrations.AddField(
            model_name='role',
            name='module',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='roles', to='register.module'),
        ),
    ]
