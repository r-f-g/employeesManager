from django.db import models
from datetime import datetime
from django.utils import timezone

class order(models.Model):
	id = models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')
	name = models.CharField(max_length=255)
	short = models.CharField(max_length=255, null=True, blank=True)
	status = models.BooleanField(default=True)
	color = models.CharField(max_length=12, default='#ffbb7f')
	info = models.TextField(null=True, blank=True)

	def __str__(self):
		return str(self.id)

class employee(models.Model):
	id = models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')
	name = models.CharField(max_length=255)
	team = models.PositiveSmallIntegerField(default=1)
	color = models.CharField(max_length=12, default='#ffffff')
	info = models.TextField(null=True, blank=True)

	def __str__(self):
		return str(self.id)

class resource(models.Model):
	id = models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')
	employee = models.ForeignKey(employee, on_delete=models.CASCADE)
	order = models.ForeignKey(order, on_delete=models.CASCADE, null=True, blank=True)
	
	availability = models.BooleanField()
	notava = models.CharField(max_length=32, null=True, blank=True)
	F = models.DateField()
	T = models.DateField()
	hours = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)

	def __str__(self):
		return str(self.id)
