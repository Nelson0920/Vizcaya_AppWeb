from django.contrib import admin
from .models import User, Role, Client, Module
# Register your models here.

admin.site.register(User)
admin.site.register(Role)
admin.site.register(Client)
admin.site.register(Module)