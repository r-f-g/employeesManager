from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^orders', views.orders, name='orders'),
	url(r'^employees', views.employees, name='employees'),
	url(r'^calendar', views.calendar, name='calendar'),
]
