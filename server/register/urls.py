from django.urls import path
from rest_framework.documentation import include_docs_urls
from .views import create_register, login, ClientCreateView, update_user, UserListView
from .chatBot import chatbot


# Versiones de la API
urlpatterns = [
    path("api/v1/users/", create_register, name='users'),
    path('api/v1/users/users-list/', UserListView.as_view(), name='user-list'),
    path("docs/", include_docs_urls(title='Registro API')),
    path('api/v1/clients/', ClientCreateView.as_view(), name='client-create'),
    path('api/v1/users/<int:user_id>/update/', update_user, name='update_user'),
    path("api/v1/login/", login, name="login"),
    path('api/v1/chatbot/', chatbot, name='chatbot')
]
