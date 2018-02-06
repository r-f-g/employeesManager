$(document).ready(function() {
	$('table.zdroje tbody').scroll(function(e) { 
		$('table.zdroje thead').css("left", -$("table.zdroje tbody").scrollLeft());
		$('table.zdroje thead th:nth-child(1)').css("left", $("table.zdroje tbody").scrollLeft()-5);
		$('table.zdroje tbody td:nth-child(1)').css("left", $("table.zdroje tbody").scrollLeft()-5);
	});
});

window.addEventListener("resize", resizeZdroje);

function resizeZdroje(){
	$('table.zdroje').css({'width':$(window).width()*0.95});
	$('table.zdroje thead').css({'width':$(window).width()*0.95});
	$('table.zdroje tbody').css({'width':$(window).width()*0.95});
	$('table.zdroje tbody').css({'height':$(window).height()*0.75});
}

function zdrojeModalTable(ename, date){
	if (ename in resources){
		if (date in resources[ename]){
			resources[ename][date]['orders'].forEach(function(d){
				var row = document.getElementById("modal_info_table").tBodies[0].insertRow(-1);
				row.style.backgroundColor = d[2];
				var cell = row.insertCell(-1);
				cell.outerHTML = "<td>"+date+"</td>";
				var cell = row.insertCell(-1);
				cell.outerHTML = "<td>"+d[0]+"</td>";
				var cell = row.insertCell(-1);
				if (d[3] == 'None'){
					cell.outerHTML = "<td>X</td>";
				}else{
					cell.outerHTML = "<td>"+d[3]+"</td>";
				}
			});
		}
	}
}

function showModal(object, option=1, startDate=0, endDate=0){
	document.getElementById('modal_bt_add').style.display = '';
	document.getElementById('modal_availability').value = 'availability';
	$('[id="modal_order"]').show();
	document.getElementById('modal_info_table').style.display = 'none';
	$("#modal_info_table tbody tr").remove(); 
	if (option == 1){
		document.getElementById("modal_title").innerHTML = 'Pridať pre '+object.parentNode.getAttribute('ename').bold();
		document.getElementById("modal_name").value = object.parentNode.getAttribute('ename');
	} else if (option == 2){
		var date = object.attr('date');
		if (object.attr('type') == 'unavailability' ||  object.attr('type') == 'vacation'){
			document.getElementById('modal_bt_add').style.display = 'none';
			document.getElementById('modal_availability').value = object.attr('type');
			$('[id="modal_order"]').hide();
		} else if (object.attr('type') == 'working'){
			document.getElementById('modal_info_table').style.display = '';
			zdrojeModalTable(object.parent().attr('ename'), date);
		}
		$('#modal_from').val(date);
		$('#modal_to').val(date);
		document.getElementById("modal_title").innerHTML = 'Pridať pre '+object.parent().attr('ename').bold();
		document.getElementById("modal_name").value = object.parent().attr('ename');
	}else if (option == 3){
		$('#modal_from').val(startDate);
		$('#modal_to').val(endDate);
		document.getElementById('modal_info_table').style.display = '';
		var s = new Date(startDate);
		var e = new Date(endDate);
		var n = zdrojeGetNumberOfDays(s, e);
		for (var i = 0; i <= n; i++) {
			var date = zdrojeDate(s, 0);
			zdrojeModalTable(object.parent().attr('ename'), date);
			s.addDays(1);
		}
		document.getElementById("modal_title").innerHTML = 'Pridať pre '+object.parent().attr('ename').bold();
		document.getElementById("modal_name").value = object.parent().attr('ename');
	}
	$("#modal").modal();
}

function zdrojeGetNumberOfDays(d1, d2){
	var timeDiff = Math.abs(d1.getTime() - d2.getTime());
	return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

function zdrojeHighlighted(name, startDate, endDate){
	$("table.zdroje td.zdrojeBody").removeClass('highlighted');
	var row = $("table.zdroje td.zdrojeBody, [ename='"+name+"']");
	var s = new Date(startDate);
	var e = new Date(endDate);
	var n = zdrojeGetNumberOfDays(s, e);
	if (s < e){
		for (var i = 0; i <= n; i++) {
			var cell = row.find("[date="+zdrojeDate(s, 0)+"]");
			cell.toggleClass("highlighted");
			s.addDays(1);
		}
		return 1;
	}else if (e < s){
		for (var i = 0; i <= n; i++) {
			var cell = row.find("[date="+zdrojeDate(e, 0)+"]");
			cell.toggleClass("highlighted");
			e.addDays(1);
		}
		return -1;
	} else {
		var cell = row.find("[date="+zdrojeDate(s, 0)+"]");
		cell.toggleClass("highlighted");
		return 0;
	}

}

$(document).ready(function() {
	var selectEmployee = '';
	var startDate = ''; 
	var endDate = ''; 
	var reverse = 0;
	$("table.zdroje td.zdrojeBody")
	.mousedown(function () {
		isMouseDown = true;
		selectEmployee = $(this).parent().attr('ename');
		startDate = $(this).attr('date');
		endDate = $(this).attr('date');
		$(this).toggleClass("highlighted");
		return false; // prevent text selection
	})
	.mouseover(function () {
		if (selectEmployee == $(this).parent().attr('ename')) {
			endDate = $(this).attr('date');
			reverse = zdrojeHighlighted(selectEmployee, startDate, endDate);
		}
	})
	.mouseup(function () {
		selectEmployee = '';
		$("table.zdroje td.zdrojeBody").removeClass('highlighted');
		if (reverse == 1){
			showModal($(this), 3, startDate, endDate);
		}else if (reverse == -1){
			showModal($(this), 3, endDate, startDate);
		}else{
			showModal($(this), 2);
		}
	})
});

function shModalOption(object) {
	if (object.value == 'availability') {
		$('[id="modal_order"]').show();
		document.getElementById('modal_info_table').style.display = '';
	} else {
		$('[id="modal_order"]').hide();
		document.getElementById('modal_info_table').style.display = 'none';
	}
}

Date.prototype.addDays = function(days) {
	this.setDate(this.getDate() + parseInt(days));
	return this;
}

function zdrojeHeader(table, start, end){
	var months = ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December']
	var days = ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So']
	var header = table.createTHead();
	var row0 = header.insertRow(-1);
	var row1 = header.insertRow(-1);
	var cell = row0.insertCell(-1);
	cell.outerHTML = "<th></th>";
	var cell = row1.insertCell(-1);
	cell.outerHTML = "<th></th>";
	var pmonth = true;
	var date = [];
	var n = zdrojeGetNumberOfDays(start, end);
	for (var i = 0; i <= n; i++) {
		if (start.getDate() == 1) { pmonth = true}
		if (pmonth == true) {
			var cell = row0.insertCell(-1);
			var ldom = new Date(start.getFullYear(), start.getMonth()+1, 0);
			if (ldom < end){
				var nod = (ldom.getDate()-start.getDate()+1);	
			} else {
				var nod = (end.getDate()-start.getDate());
			}
			cell.outerHTML = "<th colspan='"+nod+"'>"+months[start.getMonth()].substring(0, nod*2)+"</th>";
			pmonth = false;
		}
		var cell = row1.insertCell(-1);
		if (start.getDay() == 6 || start.getDay() == 0){
			if (start.getDay() == 0){
				cell.outerHTML = "<th style='background-color: #67a2d4;border-right: solid 1px #000;'>"+days[start.getDay()]+"<br/>"+start.getDate()+"</th>";	
			} else {
				cell.outerHTML = "<th style='background-color: #67a2d4;'>"+days[start.getDay()]+"<br/>"+start.getDate()+"</th>";
			}
		}else{
			cell.outerHTML = "<th>"+days[start.getDay()]+"<br/>"+start.getDate()+"</th>";
		}
		date.push(zdrojeDate(start));
		start.addDays(1);
	}
	return date
}

function zdrojeDate(date, option=1) {
	var dd = date.getDate();
	var mm = date.getMonth()+1; //January is 0!
	var yyyy = date.getFullYear();
	if(dd<10){
		dd='0'+dd;
	}
	if(mm<10){
		mm='0'+mm;
	}
	if (option == 1){
		if (date.getDay() == 0){
			return '#'+yyyy+'-'+mm+'-'+dd;
		}
	}
	return yyyy+'-'+mm+'-'+dd;
}

function zdrojeUsedOrder(usedOrder, orders, d){
	orders.forEach(function (order){
		if (!(order[1] in usedOrder)){
			usedOrder[order[1]] = {'order':[order[0], order[2]]};
		}
		usedOrder[order[1]][d] = 1;
	});
	return usedOrder;
}

function zdrojeTestDate(date){
	if(date.substring(0, 1) == '#'){
		return [date.substring(1, 11), true];
	} else {
		return [date, false];
	}
}

function zdrojeBody(table, date){
	var usedOrder = {};
	var tdstyle = '';
	employees.forEach(function(employee) {
		var row = table.tBodies[0].insertRow(-1);
		row.style.backgroundColor = employee[1];
		row.style.height = '30px';
		row.setAttribute('ename', employee[0]);
		var cell = row.insertCell(-1);
		if (employee[0].length > 15){
			cell.outerHTML = "<td onclick='showModal(this);' style='background-color:"+employee[1]+"; font-size:12px;'><strong>"+employee[0]+"</strong></td>";
		} else {
			cell.outerHTML = "<td onclick='showModal(this);' style='background-color:"+employee[1]+"; font-size:16px;'><strong>"+employee[0]+"</strong></td>";			
		}
		if (employee[0] in resources){
			date.forEach(function(d) {
				var cell = row.insertCell(-1);
				var test = zdrojeTestDate(d);
				d = test[0];
				if (test[1] == true){
					tdstyle = 'style="border-right: solid 1px #000;"';
				} else {
					tdstyle = '';
				}
				if (d in resources[employee[0]]){
					zdrojeUsedOrder(usedOrder, resources[employee[0]][d]['orders'], d);
					if (resources[employee[0]][d]["hours"] == -2){
						cell.outerHTML = "<td class='zdrojeBody' type='unavailability' date='"+d+"' "+tdstyle+"><span class='zdroje-unavailability'><strong style='font-size: 18px;'>&times;</strong></span></td>";	
					}else if (resources[employee[0]][d]["hours"] == -1){
						cell.outerHTML = "<td class='zdrojeBody' type='vacation' date='"+d+"' "+tdstyle+"><span class='zdroje-unavailability'><strong style='font-size: 18px;'>D</strong></span></td>";	
					}else{
						//cell.outerHTML = "<td class='zdrojeBody' type='working' date='"+d+"'>"+resources[employee[0]][d]["hours"]+"</td>";
						var oHTML = "<td class='zdrojeBody' type='working' date='"+d+"' "+tdstyle+"><svg width='38'height='25' viewBox='0 0 38 25' style='display: block;'>";
						var w = 38/resources[employee[0]][d]["orders"].length;
						resources[employee[0]][d]["orders"].forEach(function (ord, i){
							oHTML += "<rect x='"+i*w+"' width='"+w+"' height='25' style='fill:"+ord[2]+";opacity: 0.6;'/>";
						});
						if (resources[employee[0]][d]["hours"].toString().length > 3) {
							oHTML += "<text x='0' y='17' font-family='Verdana' font-size='12' fill='black' style='font-weight: bold;'>"+resources[employee[0]][d]["hours"]+"</text></svg></td>";	
						} else if (resources[employee[0]][d]["hours"].toString().length == 3){
							oHTML += "<text x='3' y='17' font-family='Verdana' font-size='14' fill='black' style='font-weight: bold;'>"+resources[employee[0]][d]["hours"]+"</text></svg></td>";	
						} else if (resources[employee[0]][d]["hours"].toString().length == 2){
							oHTML += "<text x='3' y='19' font-family='Verdana' font-size='18' fill='black' style='font-weight: bold;'>"+resources[employee[0]][d]["hours"]+"</text></svg></td>";
						} else {
							oHTML += "<text x='9' y='19' font-family='Verdana' font-size='18' fill='black' style='font-weight: bold;'>"+resources[employee[0]][d]["hours"]+"</text></svg></td>";
						}
						
						cell.outerHTML = oHTML;
					}
				} else {
					cell.outerHTML = "<td class='zdrojeBody' type='free' date='"+d+"' "+tdstyle+">-</td>";
				}
			});
		} else {
			date.forEach(function(d) {
				var cell = row.insertCell(-1);
				var test = zdrojeTestDate(d);
				d = test[0];
				if (test[1] == true){
					tdstyle = 'style="border-right: solid 1px #000;"';
				} else {
					tdstyle = '';
				}
				cell.outerHTML = "<td class='zdrojeBody' type='free' date='"+d+"' "+tdstyle+">-</td>";
			});
		}
	});
	return usedOrder;
}

function zdrojeFooter(table, date, usedOrder){
	var tdstyle = '';
	var row = table.tBodies[0].insertRow(-1);
	row.style.backgroundColor = '#000000';
	var cell = row.insertCell(-1);
	cell.outerHTML = "<td style='height: 10px;'></td>";
	var cell = row.insertCell(-1);
	cell.outerHTML = "<td style='height: 10px;' colspan='"+date.length+"'></td>";
	for (var ord in usedOrder) {
		var row = table.tBodies[0].insertRow(-1);
		row.setAttribute('order', ord);
		var cell = row.insertCell(-1);
		if (usedOrder[ord]['order'][0].length > 15){
			cell.outerHTML = "<td style='background-color:"+usedOrder[ord]['order'][1]+"; font-size:10px;'><strong>"+usedOrder[ord]['order'][0]+"</strong></td>";	
		} else {
			cell.outerHTML = "<td style='background-color:"+usedOrder[ord]['order'][1]+"; font-size:16px;'><strong>"+usedOrder[ord]['order'][0]+"</strong></td>";
		}
		date.forEach(function(d) {
			var cell = row.insertCell(-1);
			var test = zdrojeTestDate(d);
			d = test[0];
			if (test[1] == true){
				tdstyle = "border-right: solid 1px #000;";
			} else {
				tdstyle = "";
			}
			if (d in usedOrder[ord]){
				cell.outerHTML = "<td style='background-color:"+usedOrder[ord]['order'][1]+";"+tdstyle+"'></td>";
			} else {
				cell.outerHTML = "<td style='"+tdstyle+"'></td>";
			}
		});
	}
}

function zdrojeHours(availability, vacation, hours){
	if (availability == "False"){
		return -2
	} else if (vacation == "True"){
		return -1
	} else {
		return Number(hours)
	}
}

function zdrojeTable(from, to){
	var start = new Date(from);
	var end = new Date(to);
	var table = document.getElementsByClassName("zdroje")[0];
	var date = zdrojeHeader(table, start, end.addDays(1));
	usedOrder = zdrojeBody(table, date);
	zdrojeFooter(table, date, usedOrder);
	resizeZdroje()
}