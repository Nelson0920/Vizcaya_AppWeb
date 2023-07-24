from django.contrib import admin
from .models import Product, Category, Comment, Order, OrderDetail, FeaturedProduct

# Register your models here.

admin.site.register(Product)
admin.site.register(Category)
admin.site.register(Comment)
admin.site.register(Order)
admin.site.register(OrderDetail)
admin.site.register(FeaturedProduct)


#-----------Auditoria--------------------
from .models import ProductAudit


admin.site.register(ProductAudit)

