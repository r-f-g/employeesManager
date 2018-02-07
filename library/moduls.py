from resources.models import resource, employee, order
from django.db.models import Q
import datetime

def orders(request):
	try:
		select_status = True if (request.POST['filter_status'] == 'active' or request.POST['filter_status'] == 'True') else False
	except:
		select_status = True
	data = order.objects.filter(status=select_status)
	return data, select_status

def resources_option(request):
	try:
		dateFrom = datetime.datetime.strptime(request.POST['From'], '%Y-%m-%d')
	except:
		dateFrom = datetime.datetime.today() - datetime.timedelta(days=14)
	try:
		dateTo = datetime.datetime.strptime(request.POST['To'], '%Y-%m-%d')
	except:
		dateTo = dateFrom + datetime.timedelta(days=46)
	return {'From': dateFrom, 'To': dateTo}

def calendarDataConvert(name, request):
	if name == 'hours':
		return float(request.POST[name]) if request.POST[name] != '' else 0
	elif name == 'order':
		return order.objects.filter(id=int(request.POST[name])).get() if request.POST[name] != '' else None
	elif name == 'employee':
		return employee.objects.filter(id=int(request.POST[name])).get() if request.POST[name] != '' else None
	elif name == 'availability':
		if request.POST[name] == 'availability':
			return True
		else:
			return False
	elif name == 'notava':
		if request.POST['availability'] == 'unavailability':
			return 'X'
		elif request.POST['availability'] == 'vacation':
			return 'V'
		elif request.POST['availability'] == 'holiday':
			return 'H'
		else:
			return None
	else:
		return request.POST[name] if request.POST[name] != '' else None

def testAvailability(request):
	id, F, T = int(request.POST['employee']), datetime.datetime.strptime(request.POST['F'], '%Y-%m-%d'), datetime.datetime.strptime(request.POST['T'], '%Y-%m-%d')
	if request.POST['availability'] == 'availability':
		for r in resource.objects.filter(employee=id).filter((Q(F__lte=F) & Q(T__gte=F))|(Q(F__lte=T) & Q(T__gte=T))|(Q(F__gte=F) & Q(F__lte=T))):
			if r.availability == False:
				return False		
	else:
		if resource.objects.filter(employee=id).filter((Q(F__lte=F) & Q(T__gte=F))|(Q(F__lte=T) & Q(T__gte=T))|(Q(F__gte=F) & Q(F__lte=T))).count() > 0:
			return False
	return True

def removeResources(request):
	id, F, T = int(request.POST['employee']), datetime.datetime.strptime(request.POST['F'], '%Y-%m-%d'), datetime.datetime.strptime(request.POST['T'], '%Y-%m-%d')
	e = employee.objects.filter(id=id).get()
	test = resource.objects.filter(employee=id).filter((Q(F__gte=F) & Q(T__lte=T))|(Q(F__lte=F) & Q(T__gte=T))|(Q(F__gte=F) & Q(F__lte=T))|(Q(T__gte=F) & Q(T__lte=T)))
	if test.count() > 0:
		for t in test:
			eF = (F - datetime.timedelta(days=1)).date()
			eT = (T + datetime.timedelta(days=1)).date()
			if t.F < F.date() and t.F <= eF: resource.objects.create(employee=e, order=t.order, F=t.F, T=eF, availability=t.availability, notava=t.notava, hours=t.hours)
			if t.T > T.date() and eT <= t.T: resource.objects.create(employee=e, order=t.order, F=eT, T=t.T, availability=t.availability, notava=t.notava, hours=t.hours)
			t.delete()