from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^orders', views.orders, name='orders'),
	url(r'^employees', views.employees, name='employees'),
	#url(r'^zamestnanci/$', views.zamestnanci, name='zamestnanci'),
	# url(r'^zamestnanci/add$', views.addZamestnanci, name='addZamestnanci'),
	# url(r'^zamestnanci/edit$', views.editZamestnanci, name='editZamestnanci'),
	# url(r'^zamestnanci/delete$', views.deleteZamestnanci, name='deleteZamestnanci'),
	# url(r'^zakazky/$', views.zakazky, name='zakazky'),
	# url(r'^zakazky/load$', views.zakazky, name='loadZakazky'),
	# url(r'^zakazky/add$', views.addZakazky, name='addZakazky'),
	# url(r'^zakazky/edit$', views.editZakazky, name='editZakazky'),
	# url(r'^zdroje/$', views.zdroje, name='zdroje'),
	# url(r'^zdroje/load$', views.loadZdroje, name='loadZdroje'),
	# url(r'^zdroje/delete$', views.deleteZdroje, name='deleteZdroje'),
	# url(r'^zdroje/add$', views.addZdroje, name='addZdroje'),
	# url(r'^zdroje/schedule$', views.scheduleZdroje, name='scheduleZdroje'),
]
