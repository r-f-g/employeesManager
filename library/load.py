from resources.models import resource, employee, order

def orders(request):
	try:
		select_status = True if (request.POST['filter_status'] == 'active' or request.POST['filter_status'] == 'True') else False
	except:
		select_status = True
	data = order.objects.filter(status=select_status)
	return data, select_status