from django.urls import path
from .views import register_view, login_view, logout_view, get_csrf_token

urlpatterns = [
    path("csrf/", get_csrf_token, name="get_csrf_token"),
    path("register/", register_view, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
]
