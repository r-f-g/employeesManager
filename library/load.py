from resources.models import resource, employee, order
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