from django.shortcuts import render
from .models import order, employee, resource
from .library import load
from django.contrib import messages


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
	data, select_status = load.orders(request)
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