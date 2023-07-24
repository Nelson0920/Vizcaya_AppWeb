from django.db import models
from django.utils import timezone


class Role(models.Model):
    role_name = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.role_name


class Module(models.Model):
    insert_prd = models.BooleanField(default=False)
    edit_prd = models.BooleanField(default=False)
    delete_prd = models.BooleanField(default=False)
    checkout_prd = models.BooleanField(default=False)
    com_usr = models.BooleanField(default=False)
    log_usr = models.BooleanField(default=False)
    shopping_history = models.BooleanField(default=False)
    sales_history = models.BooleanField(default=False)
    dashboard = models.BooleanField(default=False)
    settings = models.BooleanField(default=False)

    def __str__(self):
        return f'Module: {self.id}'


class User(models.Model):
    nam_reg = models.CharField(max_length=200, default=None)
    eml_reg = models.CharField(max_length=200, default=None, unique=True)
    cell_reg = models.CharField(max_length=30, default=None)
    pwd_reg = models.CharField(max_length=80, default=None)
    fec_reg = models.DateTimeField(default=timezone.now)
    del_reg = models.IntegerField(default=1)
    role = models.ForeignKey(Role, on_delete=models.CASCADE, default=1, related_name='users')
    custom_module = models.ForeignKey(Module, on_delete=models.SET_NULL, null=True, blank=True, default=1, related_name='users_with_custom_module')

    def __str__(self):
        return f"{self.id} - {self.role} - {self.nam_reg}"


class Client(models.Model):
    id_user = models.ForeignKey(User, on_delete=models.CASCADE)
    ced_cli = models.CharField(max_length=20)
    add_cli = models.TextField()
    sta_cli = models.CharField(max_length=50)
    cit_cli = models.CharField(max_length=50)
    zip_cli = models.CharField(max_length=10)

    def __str__(self):
        return f'{self.ced_cli} - {self.add_cli}'
