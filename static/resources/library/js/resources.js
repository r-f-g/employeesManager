function load(data){
	return JSON.parse(data.replace('<QuerySet ','').replace('>','').replace(/None/g,null).replace(/True/g,true).replace(/False/g,false).replace(/'/g,'"').replace(/\(/g,"[").replace(/\)/g,"]"));
}

function resourcesHighlighted(id, startDate, endDate){
	$("table.resources td.resourcesBody").removeClass('highlighted');
	var row = $("table.resources td.resourcesBody, [id='"+id+"']");
	var s = new Date(startDate);
	var e = new Date(endDate);
	var n = resourcesGetNumberOfDays(s, e);
	if (s < e){
		for (var i = 0; i <= n; i++) {
			var cell = row.find("[date="+resourcesDate(s, 0)+"]");
			cell.toggleClass("highlighted");
			s.addDays(1);
		}
		return 1;
	}else if (e < s){
		for (var i = 0; i <= n; i++) {
			var cell = row.find("[date="+resourcesDate(e, 0)+"]");
			cell.toggleClass("highlighted");
			e.addDays(1);
		}
		return -1;
	} else {
		var cell = row.find("[date="+resourcesDate(s, 0)+"]");
		cell.toggleClass("highlighted");
		return 0;
	}

}

function resizeResources(){
	$('table.resources').css({'width':$(window).width()*0.95});
	$('table.resources thead').css({'width':$(window).width()*0.95});
	$('table.resources tbody').css({'width':$(window).width()*0.95});
	$('table.resources tbody').css({'height':$(window).height()*0.75});
}

function createResourcesTable(from, to, employees, resources, orders){
	var start = new Date(from);
	var end = new Date(to);
	var table = document.getElementsByClassName("resources")[0];
	var date = resourcesTableHeader(table, start, end.addDays(1));
	var body = resourcesTableBody(table, date, employees, transformResources(resources), orders);
	resourcesTableFooter(table, date, body.usedOrder);
	resizeResources();
	return body.tresources;
}

Date.prototype.addDays = function(days) {
	this.setDate(this.getDate() + parseInt(days));
	return this;
}

function resourcesNumberToDate(number){
	var year = ((number - number%10000)/10000).toFixed(0);
	var month = ((number%10000 - number%100)/100).toFixed(0)-1;
	var day = (number%100).toFixed(0);
	return new Date(year, month, day);
}

function resourcesDateArray(from, to){
	var out = [];
	var start = resourcesNumberToDate(from);
	var end = resourcesNumberToDate(to);
	while (start <= end){
		out.push(resourcesDate(start, 0));
		start.addDays(1);
	}
	return out;
}

function transformResources(resources) {
	var out = {};
	for (var i = 0; i < resources.length ; i++) {
		var employee = resources[i][0];
		if (!(resources[i][0] in out)) { out[employee] = {}}
		var days = resourcesDateArray(resources[i][4], resources[i][5]);
		for (var j = 0; j < days.length; j++){
			if (!(days[j] in out[employee])){
				out[employee][days[j]] = {'hours':resources[i][6], 'availability': resources[i][2], 'symbol': resources[i][3], 'orders':[[resources[i][1], resources[i][6]]]}
			}else if(out[employee][days[j]]['availability']){
				out[employee][days[j]]['hours'] += resources[i][6];
				out[employee][days[j]]['availability'] = resources[i][2];
				out[employee][days[j]]['symbol'] = resources[i][3];
				out[employee][days[j]]['orders'].push([resources[i][1], resources[i][6]]);
			}
		}
	}
	return out;
}

function resourcesGetNumberOfDays(d1, d2){
	var timeDiff = Math.abs(d1.getTime() - d2.getTime());
	return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

function resourcesDate(date, option=1) {
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
			return [yyyy+'-'+mm+'-'+dd, true];
		}else{
			return [yyyy+'-'+mm+'-'+dd, false];
		}
	}
	return yyyy+'-'+mm+'-'+dd;
}

function resourcesTableHeader(table, start, end){
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	var days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
	var header = table.createTHead();
	var row0 = header.insertRow(-1);
	var row1 = header.insertRow(-1);
	var cell = row0.insertCell(-1);
	cell.outerHTML = "<th></th>";
	var cell = row1.insertCell(-1);
	cell.outerHTML = "<th></th>";
	var pmonth = true;
	var date = [];
	var n = resourcesGetNumberOfDays(start, end);
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
		date.push(resourcesDate(start));
		start.addDays(1);
	}
	return date
}

function resourcesTestDate(date){
	if(date[1]){
		return 'style="border-right: solid 1px #000;"';
	} else {
		return '';
	}
}

function resourcesTableFooter(table, date, usedOrder){
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
		var fontSize = (22 - usedOrder[ord]['order'][0].length/3);
		cell.outerHTML = "<td style='background-color:"+usedOrder[ord]['order'][1]+"; font-size:"+ (fontSize > 9 ? fontSize : 9) + "px; word-wrap: break-word;'><strong>"+usedOrder[ord]['order'][0]+"</strong></td>";	
		date.forEach(function(d) {
			var cell = row.insertCell(-1);
			var dstyle = resourcesTestDate(d);
			if (d[0] in usedOrder[ord]){
				cell.outerHTML = "<td style='background-color:"+usedOrder[ord]['order'][1]+";"+dstyle+"'></td>";
			} else {
				cell.outerHTML = "<td style='"+dstyle+"'></td>";
			}
		});
	}
}

function resourcesUsedOrder(usedOrder, rorders, d, orders){
	rorders.forEach(function (order){
		if (!(order[0] in usedOrder)){
			usedOrder[order[0]] = {'order':[orders[order[0]]['name'], orders[order[0]]['color']]};
		}
		usedOrder[order[0]][d] = 1;
	});
	return usedOrder;
}

function resourcesTableBody(table, date, employees, tresources, orders){
	var usedOrder = {};
	employees.forEach(function(employee) {
		var row = table.tBodies[0].insertRow(-1);
		row.style.backgroundColor = employee[2];
		row.style.height = '30px';
		row.setAttribute('id', employee[0]);
		row.setAttribute('name', employee[1]);
		var cell = row.insertCell(-1);
		var fontSize = (22 - employee[1].length/3);
		cell.outerHTML = "<td onclick='showModal(this);' style='background-color:"+employee[2]+"; font-size:" + (fontSize > 9 ? fontSize : 9) + "px; word-wrap: break-word;'><strong>"+employee[1]+"</strong></td>";
		date.forEach(function(d) {
			var cell = row.insertCell(-1);
			var dstyle = resourcesTestDate(d);
			if (employee[0] in tresources){
				if (d[0] in tresources[employee[0]]){
					if (tresources[employee[0]][d[0]]['availability']){
						resourcesUsedOrder(usedOrder, tresources[employee[0]][d[0]]['orders'], d[0], orders);
						var oHTML = "<td class='resourcesBody' type='working' date='"+d[0]+"' "+dstyle+"><svg width='38'height='25' viewBox='0 0 38 25' style='display: block;'>";
						var w = 38/tresources[employee[0]][d[0]]["orders"].length;
						tresources[employee[0]][d[0]]["orders"].forEach(function (ord, i){
							oHTML += "<rect x='"+i*w+"' width='"+w+"' height='25' style='fill:"+orders[ord[0]]['color']+";'/>";
						});
						if (tresources[employee[0]][d[0]]["hours"].toString().length > 3) {
							oHTML += "<text x='0' y='17' font-family='Verdana' font-size='12' fill='black' style='font-weight: bold;'>"+tresources[employee[0]][d[0]]["hours"]+"</text></svg></td>";	
						} else if (tresources[employee[0]][d[0]]["hours"].toString().length == 3){
							oHTML += "<text x='3' y='17' font-family='Verdana' font-size='14' fill='black' style='font-weight: bold;'>"+tresources[employee[0]][d[0]]["hours"]+"</text></svg></td>";	
						} else if (tresources[employee[0]][d[0]]["hours"].toString().length == 2){
							oHTML += "<text x='3' y='19' font-family='Verdana' font-size='18' fill='black' style='font-weight: bold;'>"+tresources[employee[0]][d[0]]["hours"]+"</text></svg></td>";
						} else {
							oHTML += "<text x='9' y='19' font-family='Verdana' font-size='18' fill='black' style='font-weight: bold;'>"+tresources[employee[0]][d[0]]["hours"]+"</text></svg></td>";
						}
						
						cell.outerHTML = oHTML;
					}else{
						cell.outerHTML = "<td class='resourcesBody' type='unavailability' date='"+d[0]+"' "+dstyle+"><span class='resources-unavailability'><strong style='font-size: 18px;'>"+tresources[employee[0]][d[0]]['symbol']+"</strong></span></td>";
					}
				}else{
					cell.outerHTML = "<td class='resourcesBody' type='free' date='"+d[0]+"' "+dstyle+">-</td>";
				}
			}else{
				cell.outerHTML = "<td class='resourcesBody' type='free' date='"+d[0]+"' "+dstyle+">-</td>";
			}
		});
	});
	return {usedOrder:usedOrder, tresources:tresources};
}

function shModalOption(object) {
	if (object.value == 'availability') {
		$('[id="modal_order"]').show();
		$('#modal_info_table').hide();
	} else {
		$('[id="modal_order"]').hide();
		$('#modal_info_table').hide();
	}
}

function showModalInfoTable(id, from, to){
	$('#modal_employee').val(id);
	var start = new Date(from);
	var end = new Date(to);
	if (id in tresources) {
		while (start <= end) {
			var date = resourcesDate(start, 0);
			if (date in tresources[id]){
				tresources[id][date]['orders'].forEach(function(order){
					var row = document.getElementById("modal_info_table").tBodies[0].insertRow(-1);
					var cell = row.insertCell(-1);
					cell.outerHTML = "<td>"+date+"</td>";
					var cell = row.insertCell(-1);
					if (tresources[id][date]['availability']){
						cell.outerHTML = "<td>"+orders[order[0]]['name']+"</td>";
						var cell = row.insertCell(-1);
						row.style.backgroundColor = orders[order[0]]['color'];
						cell.outerHTML = "<td>"+order[1]+"</td>";
					}else{
						cell.outerHTML = "<td></td>";
						var cell = row.insertCell(-1);
						cell.outerHTML = "<td>"+tresources[id][date]['symbol']+"</td>";
					}
				});
			}
			start.addDays(1);
		}
	}
	$('#modal_info_table').show();
}

function showModal(object, option=1, startDate=0, endDate=0){
	$('#modal_info_table tbody tr').remove();
	$('#modal_info_table').hide();
	$('[id="modal_order"]').show();
	$('#modal_title').text($(object).parent().attr('name'));
	if (option == 2){
		$('#modal_from').val(startDate);
		$('#modal_to').val(endDate);
		showModalInfoTable($(object).parent().attr('id'), startDate, endDate);
	}else{
		$('#modal_from').val(resourcesDate(new Date(), 0));
		$('#modal_to').val(resourcesDate(new Date(), 0));
	}
	$("#modal").modal();
}