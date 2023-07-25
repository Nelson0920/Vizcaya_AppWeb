from django.urls import path, include
from rest_framework import routers
from products import views

router = routers.DefaultRouter()
router.register(r'products', views.ProductViewSet, basename='products')
router.register(r'products/(?P<product_pk>\d+)/comments', views.CommentViewSet, basename='product-comments')

urlpatterns = [
    # Otras rutas de tu aplicación
    path('api/v2/', include(router.urls)),
    path('api/v2/products/<int:product_pk>/create_comment/', views.CreateCommentAPIView.as_view(), name='create-comment'),
    path('api/v2/products/<int:pk>/update_qty/', views.UpdateProductQtyAPIView.as_view(), name='update_product_qty'),
    path('api/v3/products/orders/', views.OrderListCreateView.as_view(), name='order-list'),
    path('api/v3/products/<int:user_id>/orders/', views.OrderDetailView.as_view(), name='order-detail'),
    path('api/v3/products/order-details/', views.OrderDetailListCreateView.as_view(), name='order-detail-list'),
    path('api/v3/products/<int:pk>/order-details/', views.OrderDetailDetailView.as_view(), name='order-detail-detail'),
    path('api/v3/products/user/orders/', views.UserDetailView.as_view(), name='user-detail'),
    
    path('api/v3/products/top/', views.top_products, name='top-products'),
    path('api/v3/products/top-categories/', views.top_categories, name='top-categories'),
    path('api/v3/products/top-selling-months/', views.top_selling_months, name='top_selling_months'),
    path('api/v3/products/total-sales-by-month/', views.total_sales_by_month, name='total_sales_by_month'),

    path('api/v3/products/product-stars/<int:user_id>/', views.FeaturedProductListView.as_view(), name='product_stars'),
    path('api/v3/products/product-stars-summary/<int:product_id>/', views.product_stars_summary, name='product_stars_summary'),
    
    path('api/product_audits/', views.create_product_audit, name='create_product_audit'),
    path('api/get-product-audit/', views.ProductAuditListView.as_view(), name='product-audit-list'),
]
