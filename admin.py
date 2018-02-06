from django.contrib import admin
from .models import resource, order, employee

class resourceAdmin(admin.ModelAdmin):
	list_display = ('id', 'employee_name', 'order_name', 'availability', 'notava', 'F', 'T', 'hours')
	list_display_links = ('id',)
	search_fields = ('employee_name', 'order_name')
	list_per_page = 25

	def employee_name(self, instance):
		return instance.employee.name

	def order_name(self, instance):
		return instance.order.name

admin.site.register(resource, resourceAdmin)

class orderAdmin(admin.ModelAdmin):
	list_display = ('id', 'name', 'short', 'color', 'status')
	list_display_links = ('id',)
	search_fields = ('name', 'short', 'color')
	list_per_page = 25

admin.site.register(order, orderAdmin)

class employeeAdmin(admin.ModelAdmin):
	list_display = ('id', 'name', 'color', 'info')
	list_display_links = ('id',)
	search_fields = ('name', 'color', 'info')
	list_per_page = 25

admin.site.register(employee, employeeAdmin)