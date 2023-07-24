from django.db import models
from django.utils import timezone

from register.models import Client, User

class Category(models.Model):
    cat_prd = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.cat_prd


class Product(models.Model):
    nam_prd = models.CharField(max_length=100)
    prc_prd = models.DecimalField(max_digits=10, decimal_places=2)
    img_prd = models.ImageField(upload_to='product_images', default='product_images/default.gif')
    desc_prd = models.TextField(blank=True, null=True)
    qty_prd = models.PositiveIntegerField(default=0)
    fec_prd = models.DateTimeField(default=timezone.now)
    cat_prd = models.ForeignKey(Category, on_delete=models.CASCADE, default=1)
    del_prd = models.IntegerField(default=1)

    def __str__(self):
        return self.nam_prd


class Comment(models.Model):
    prd_com = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='comments')
    cont_com = models.TextField()
    fec_com = models.DateTimeField(default=timezone.now)
    nom_com = models.CharField(max_length=200, default=None)

    def __str__(self):
        return f'Comment by {self.nom_com} - {self.fec_com}'
    

class Order(models.Model):
    fec_ord = models.DateTimeField(default=timezone.now)
    sub_iva = models.DecimalField(max_digits=10, decimal_places=2)
    tot_ord = models.DecimalField(max_digits=20, decimal_places=2)
    id_cli = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='orders')

    def __str__(self):
        return f'Order ID: {self.id}'


class OrderDetail(models.Model):
    id_prd = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True, related_name='order_details')
    id_ord = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_details')
    qty_prd = models.PositiveIntegerField(default=0)
    sub_prd = models.DecimalField(max_digits=10, decimal_places=2)

    # Campo adicional para almacenar la información del producto eliminado
    #deleted_prd = models.ForeignKey(Product, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='deleted_order_details')

    def __str__(self):
        return f'Order Detail ID: {self.id}'


class FeaturedProduct(models.Model):
    id_user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    rank_prd = models.IntegerField(default=0)

    def __str__(self):
        return f'Featured Product: {self.product.nam_prd}'
    

#-----------Auditoria--------------------

class ProductAudit(models.Model):
    ACTION_CHOICES = (
        ('C', 'Created'),
        ('U', 'Updated'),
        ('D', 'Deleted'),
        ('R', 'Restore'),
    )

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='audits')
    action = models.CharField(max_length=1, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)  # Campo ForeignKey para almacenar el usuario

    def __str__(self):
        return f'Auditoria del Producto: {self.product.nam_prd} / Accion: {self.get_action_display()}'

