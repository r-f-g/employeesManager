from django.shortcuts import render
from .models import order, employee, resource
from .library import moduls
from django.contrib import messages
from django.db.models import Q, FloatField
from django.db.models.functions import Cast, TruncYear, ExtractYear, ExtractMonth, ExtractDay
import datetime

def orders(request):
	if request.method == 'POST':
		if request.path_info.split('/')[-1] == 'add':
			create = {c:request.POST[c] for c in ['name','short','color','info'] if request.POST[c] != ''}
			create['status'] = True if request.POST['status'] == 'active' else False
			order.objects.create(**create)
		elif request.path_info.split('/')[-1] == 'edit':
			update = {c:(request.POST[c] if request.POST[c] != '' else None) for c in ['name','short','color','info']}
			update['status'] = True if request.POST['status'] == 'active' else False
			order.objects.filter(id=request.POST['id']).update(**update)
		elif resource.path_info.split('/')[-1] == 'delete':
			order.objects.filter(id=request.POST['id']).delete()
	data, select_status = moduls.orders(request)
	return render(request, "resources/orders.html", {'data': data, 'filter_status':select_status})

def employees(request):
	if request.method == 'POST':
		if request.path_info.split('/')[-1] == 'add':
			create = {c:request.POST[c] for c in ['name','team','color','info'] if request.POST[c] != ''}
			employee.objects.create(**create)
		elif request.path_info.split('/')[-1] == 'edit':
			update = {c:(request.POST[c] if request.POST[c] != '' else None) for c in ['name','team','color','info']}
			employee.objects.filter(id=request.POST['id']).update(**update)
		elif request.path_info.split('/')[-1] == 'delete':
			employee.objects.filter(id=request.POST['id']).delete()
	return render(request, "resources/employees.html", {'data': employee.objects.order_by('team')})

def calendar(request):
	if request.method == 'POST':
		if request.path_info.split('/')[-1] == 'add':
			if moduls.testAvailability(request) == False:
				messages.info(request, 'Employee is unavailable at this time.')
			else:
				create = {c:moduls.calendarDataConvert(c, request) for c in ['F','T','employee','order','availability','notava','hours']}
				resource.objects.create(**create)
		elif request.path_info.split('/')[-1] == 'delete':
			moduls.removeResources(request)
	option = moduls.resources_option(request)
	axes = {'orders': list(order.objects.all().values_list('id','name','color', 'status')),
			'employees': list(employee.objects.all().order_by('team').values_list('id','name','color'))}
	data = list(resource.objects.filter(Q(F__range=[option['From'], option['To']])|Q(T__range=[option['From'], option['To']]))\
				.annotate(From=10000*ExtractYear('F')+100*ExtractMonth('F')+ExtractDay('F'), To=10000*ExtractYear('T')+100*ExtractMonth('T')+ExtractDay('T') ,hours_f=Cast('hours', FloatField()))\
				.values_list('employee', 'order', 'availability', 'notava', 'From', 'To', 'hours_f'))
	return render(request, "resources/calendar.html", {'axes': axes, 'option': option, 'data': data})