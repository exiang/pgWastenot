// is this development?
$.dev = true;
// is this running on mobile devices? (use plugin), set false if you are running from desktop browser
$.mobile = true;
$.db;
$.gBaseApiUrl = "http://arcinteractive.com.my/wastenot";
$.gCategories = "";
$.gItems = "";

$.isGInited = false;

// cache image
// https://github.com/chrisben/imgcache.js

function trace()
{
	if($.dev)
	{
		var output = ""
		for (i = 0; i < arguments.length; i++) {
			output += arguments[i] +  ", ";
		}
		console.log(output);
	}
}

function centerModals(){
  $('.modal').each(function(i){
    var $clone = $(this).clone().css('display', 'block').appendTo('body');
    var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
    top = top > 0 ? top : 0;
    $clone.remove();
    $(this).find('.modal-content').css("margin-top", top);
  });
}

// eg: http://wastenotweb.com/index.php?r=api/getCategories
function composeApiUrl(action, params)
{
	var url = $.gBaseApiUrl+"/index.php?r=api/"+action;
	if(params)
	{
		$.each(params, function( key, value ) {
			url = url + "&" + key + "=" + value;
		});
	}
	return url;
}

function getDeviceType()
{
	var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
	return deviceType;
}

// eg: 	"uploads/category/main.1.jpg"
function getImageUrl(partial)
{
	return $.gBaseApiUrl + '/'+partial;
}

function go(page, params)
{
	trace("page:", $.gPageCode);
	if(params)
	{
		$.each(params, function( key, value ) {
			setLocalStorage(key, value);
		});
		trace(params);
	}
	
	var random = Math.floor((Math.random() * 1000) + 1);
	window.location = page+".html?x="+random;
	
}

function gInit()
{
	trace("call gInit()");
	
	// initialize general links
	$('#btnNavTopTitle').on('click', function(e){go('home'); e.preventDefault();});
	$('#btnNavBottomFriend').on('click', function(e){go('friend'); e.preventDefault();});
	$('#btnNavBottomList').on('click', function(e){go('home'); e.preventDefault();});
	$('#btnNavBottomAdd').on('click', function(e){go('add'); e.preventDefault();});
	
	$('.modal').on('show.bs.modal', centerModals);
	$(window).on('resize', centerModals);
	
	// device
	/*if(!$.dev)
	{
		// exiang: weird, not working
		// init db
		$.db = window.sqlitePlugin.openDatabase({name: "wastenot.db", location: 1});
	}
	// desktop
	else*/
	{
		// init db
		$.db = openDatabase('wastenot14', '1.0', 'wastenot database', 2 * 1024 * 1024);
	}
	
	// create tables
	$.db.transaction(function(tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS category (id integer PRIMARY KEY ASC, rid integer, code text, group_id integer, title text, image_main text,  is_active integer, UNIQUE(rid, code)) ');
		tx.executeSql('CREATE TABLE IF NOT EXISTS item (id integer PRIMARY KEY ASC, rid integer, title text, category_id integer, image_main text, is_active integer, UNIQUE(rid)) ');
		tx.executeSql('CREATE TABLE IF NOT EXISTS expiry (id integer PRIMARY KEY ASC, item_id integer, title text, image_main text, year_expired, month_expired, day_expired) ');
	});
	
	getCategoriesFromDb();
	getItemsFromDb();	
	
	$.isGInited = true;
}

function getLocalStorage(key)
{
	if(typeof(Storage) !== "undefined") {
		return JSON.parse(localStorage.getItem(key));
	} else {
		// Sorry! No Web Storage support..
	}
}

function setLocalStorage(key, val)
{
	if(typeof(Storage) !== "undefined") {
		// Code for localStorage/sessionStorage.
		localStorage.setItem(key, JSON.stringify(val));
	} else {
		// Sorry! No Web Storage support..
	}
}

// categories
function categoriesUnset()
{	
	$.gCategories = [];
}

function categoriesDb2G(obj)
{
	$.gCategories.push({id:obj.id, rid:obj.rid, code:obj.code, group_id:obj.group_id, title:obj.title, image_main:obj.image_main, is_active:obj.is_active});	
}

// callback method
function getCategoriesFromDb(callback) 
{
	trace("call getCategoriesFromDb()");
	$.db.transaction(function (tx) {
	tx.executeSql('SELECT * FROM category WHERE is_active=?;', ['1'],
		function (tx, results) {
			if (results.rows && results.rows.length) 
			{
				categoriesUnset();
				for (i = 0; i < results.rows.length; i++) 
				{
					var obj = results.rows.item(i);
					categoriesDb2G(obj);
				}
			}
			if (typeof(callback) == 'function')
				callback();
		},
		function (tx, error) {
		});
	});
}

function categoriesUpdateFromJson(jsonData, callback)
{
	trace("call categoriesUpdateFromJson()");
	categoriesUnset();
	
	$.each(jsonData, function( index, obj ) {
		$.gCategories.push({rid:obj.id, code:obj.code, group_id:obj.group_id, title:obj.title, image_main:obj.image_main, is_active:obj.is_active});
	});
	
	//console.log($.gCategories, $.gCategories.length);
	if($.db && $.gCategories.length >0)
	{	
		$.each($.gCategories, function(index, obj)
		{		
			$.db.transaction(function(tx) {
				if(obj) tx.executeSql("INSERT OR REPLACE INTO category (id, rid, code, group_id, title, image_main, is_active) VALUES ((SELECT id FROM category WHERE rid=?),?,?,?,?,?,?)", [obj.rid, obj.rid, obj.code, obj.group_id, obj.title, obj.image_main, obj.is_active]);
			});
		});
	}
	
	getCategoriesFromDb(callback);
}

function getCategoryById(id)
{
	var objResult ={};
	$.each($.gCategories, function(index, obj)
	{		
		if(obj.id == id) 
		{
			objResult = obj;
			return false;
		}
	});
	
	return objResult;
}


function getRemoteCategoryList(callback)
{
	trace("call getRemoteCategoryList()")
	spinnerShow();
	$.ajax({
		url: composeApiUrl("getCategories"),
		cache: true,
		//async: true
	})
	.done(function( json ) {
		if(json.status == "success")
		{
			if(json.data)
			{
				categoriesUpdateFromJson(json.data, callback);
			}
			else
			{
				getCategoriesFromDb(callback);
			}
		}
		else
		{
			getCategoriesFromDb(callback);
		}
	})
	.error(function(e){
		getCategoriesFromDb(callback);
	})
	.always(function(json){
		spinnerHide();
	});
}

// items
function itemsUnset()
{	
	$.gItems = [];
}

function itemsDb2G(obj)
{
	$.gItems.push({id:obj.id, rid:obj.rid, category_id:obj.category_id, title:obj.title, image_main:obj.image_main});	
}

function getItemsFromDb(callback) 
{
	trace("call getItemsFromDb()");
	$.db.transaction(function (tx) {
	tx.executeSql('SELECT * FROM item where is_active=?;', ['1'],
		function (tx, results) {
			if (results.rows && results.rows.length) 
			{
				itemsUnset();
				for (i = 0; i < results.rows.length; i++) 
				{
					var obj = results.rows.item(i);
					itemsDb2G(obj);
				}
			}
			if (typeof(callback) == 'function')
				callback();
		},
		function (tx, error) {
			console.log(error);
		});
	});
}

function getItemsFromDbByCategory(categoryId, callback)
{
	trace("call getItemsFromDbByCategory()", categoryId);
	$.db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM item where category_id=? AND is_active=?;", [categoryId, '1'], 
		function(tx, results) {
			var data = []
			for (var i=0 ; i<results.rows.length ; i++)
			{
				var obj = results.rows.item(i);
				data.push({text: obj.title, value:obj.id});
			}
			if (typeof(callback) == 'function') callback(data);
		}, 
		function (tx, error) {
			console.log(error);
		});
	});
}

function dummy()
{
	trace("call dummy()");
}

function itemsUpdateFromJson(jsonData)
{
	trace("call itemsUpdateFromJson()");
	itemsUnset();
	
	$.each(jsonData, function( index, obj ) {
		$.gItems.push({rid:obj.id, category_id:obj.category_id, title:obj.title, image_main:obj.image_main, is_active:obj.is_active});
	});
	
	//trace($.gCategories, $.gCategories.length);
	if($.db && $.gItems.length >0)
	{	
		$.each($.gItems, function(index, obj)
		{		
			$.db.transaction(function(tx) {
				if(obj) tx.executeSql("INSERT OR REPLACE INTO item (id, rid, category_id, title, image_main, is_active) VALUES ((SELECT id FROM item WHERE rid=?),?,?,?,?,?)", [obj.rid, obj.rid, obj.category_id, obj.title, obj.image_main, obj.is_active]);
			});
		});
	}
	
	getItemsFromDb();
}

function getItemById(id, callback)
{
	var objResult ={};
	$.each($.gItems, function(index, obj)
	{		
		if(obj.id == id) 
		{
			objResult = obj;
			return false;
		}
	});
	
	if (typeof(callback) == 'function'){
		callback(objResult); 
	}else{
		return objResult;
	}
}


function getRemoteItemList()
{
	trace("call getRemoteItemList()");
	spinnerShow();
	$.ajax({
		url: composeApiUrl("getItems"),
		cache: true,
		//async: true,
	})
	.done(function( json ) {
		if(json.status == "success")
		{
			if(json.data)
			{
				itemsUpdateFromJson(json.data);
			}
		}
	})
	.always(function(json){
		spinnerHide();
	});
}

//
// expiry
function addExpiry(category_title, category_id, title, item_id, image_main, year, month, day, callback)
{
	trace("call addExpiry()");
	
	// category are not store in table
	$.db.transaction(function(tx) {
		tx.executeSql(
			"INSERT OR REPLACE INTO expiry (title, item_id, image_main, year_expired, month_expired, day_expired) VALUES (?,?,?,?,?,?)", 
			[title, item_id, image_main, year, month, day],
			function(tx, results){
				var lastInsertedId = results.insertId;
				//console.log(lastInsertedId);
				if (typeof(callback) == 'function') callback(lastInsertedId, year, month, day);
			}
		);
	});
}

function registerNotif(lastInsertedId, year, month, day, callback)
{
	//console.log("call registerNotif()", year, month, day, lastInsertedId);
	//alert("registerNotif():"+year+month+day+"-"+lastInsertedId);
	
	countExpiryByDate(year, month, day, function(countTheDayExpiryItem)
	{
		trace("countTheDayExpiryItem: "+countTheDayExpiryItem+"|lastInsertedId:"+lastInsertedId);
		if(countTheDayExpiryItem<1) 
		{
			if (typeof(callback) == 'function') callback(lastInsertedId);
			return;
		}
		
		month = pad(month, 2);
		day = pad(day, 2);
		
		var notifId = year+""+month+""+day;
		
		// is new
		if($.mobile)
		{
			if(countTheDayExpiryItem <= 1)
			{
				var now  = new Date().getTime(),
				after5sec = new Date(now + 5*1000);
				
				var timestamp = new Date(year, month-1, day).getTime();
				if($.dev) timestamp = after5sec;
				//console.log(timestamp);
				
				
				cordova.plugins.notification.local.schedule({
					text: "You have 1 item expiring today",
					at: timestamp,
				});
				
			}
			// already got items on that day
			else
			{
				cordova.plugins.notification.local.update({
					id: notifId,
					text: "You have "+countTheDayExpiryItem+" items expiring today",
				});
			}
		}
		// for debugging
		else
		{
			if(countTheDayExpiryItem <= 1)
			{
				var timestamp = new Date(year, month-1, day).getTime();
				alert(timestamp);
			}
			// already got items on that day
			else
			{
				alert("update, notifId:"+notifId);
			}
		}
		
		if (typeof(callback) == 'function') callback(lastInsertedId);
	});
	
	
	
}

function getExpiryById(id, callback)
{
	trace("call getExpiryById()", id);
	$.db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM expiry where id=?;", [id], 
		function(tx, results) {
			var obj = results.rows.item(0);
			if (typeof(callback) == 'function') callback(obj);
		}, 
		function (tx, error) {
		});
	});
}

function getExpiryByDate(year, month, day, callback)
{
	trace("call getExpiryByDate()");
	$.db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM expiry where year_expired=? AND month_expired=? AND day_expired=?;", [year, month, day], 
		function(tx, results) {
			var data = []
			for (var i=0 ; i<results.rows.length ; i++)
			{
				var obj = results.rows.item(i);
				data.push(obj);
			}
			if (typeof(callback) == 'function') callback(data);
		}, 
		function (tx, error) {
		});
	});
}

function countExpiryByDate(year, month, day, callback)
{
	trace("call countExpiryByDate()");
	$.db.transaction(function(tx) {
		tx.executeSql("SELECT COUNT(id) as total FROM expiry where year_expired=? AND month_expired=? AND day_expired=?;", [year, month, day], 
		function(tx, results) {
			var data = 0;
			data = results.rows.item(0).total;
			if (typeof(callback) == 'function') callback(data);
		}, 
		function (tx, error) {
			if (typeof(callback) == 'function') callback(0);
		});
	});
}

//
// recipe
function getRemoteRecipeByItem(itemId, callback)
{
	trace("call getRemoteRecipeByItem()");
	spinnerShow();
	$.ajax({
		url: composeApiUrl("getRecipe"),
		data: {"item":itemId},
		cache: true,
		//async: true
	})
	.done(function( json ) {
		if(json.status == "success")
		{
			if(json.data)
			{
				if (typeof(callback) == 'function') callback(json.data);
			}
		}
	})
	.always(function(json){
		spinnerHide();
	});
}

function countRemoteRecipeByItem(itemId, callback)
{
	trace("call countRemoteRecipeByItem()");
	spinnerShow();
	$.ajax({
		url: composeApiUrl("countRecipe"),
		data: {"item":itemId},
		cache: true,
		//async: false
	})
	.done(function( json ) {
		if(json.status == "success")
		{
			if(json.data)
			{
				if (typeof(callback) == 'function') callback(json.data);
			}
		}
	})
	.always(function(json){
		spinnerHide();
	});
}

//
// date time functions
function date2timestamp(dateString)
{
	return Date.parse(dateString);
}

function timestamp2part(timestamp)
{
	date = new Date(timestamp),
	dateValues = [
	   date.getFullYear(),
	   date.getMonth()+1,
	   date.getDate(),
	   date.getHours(),
	   date.getMinutes(),
	   date.getSeconds(),
	];
	return dateValues;
}

function futureDate2part(noOfDayFromNow)
{
	trace("call futureDate2part()");
	var currentDate = new Date(new Date().getTime() + (noOfDayFromNow * 24) * 60 * 60 * 1000);
	
	dateValues = [
		currentDate.getFullYear(),
		currentDate.getMonth()+1,
		currentDate.getDate(),
	];
	
	return dateValues;
}

function daysFromNow(year, month, day)
{
	//console.log(year, month, day);
	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	var firstDate = new Date(year, month-1, day);
	var secondDate = new Date();
	
	var todayPart = timestamp2part(secondDate.getTime());
	if(todayPart[0] == year && todayPart[1] == month && todayPart[2] == day)
	{	
		var diffDays = 0;
	}
	else
	{	
		var diffDays = Math.ceil(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
	}
	//if(diffDays < 1){ diffDays = 0; }else{diffDays = Math.floor(diffDays);}
	//console.log(diffDays)
	return diffDays;
}

//
// others
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function byPriority()
{
	for (var i = 0; i < arguments.length; ++i)
	{
		if(arguments[i] != '') return arguments[i];
	}
}

function getMonthName(m)
{
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
	  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];
	
	return monthNames[m];
}

function noticeAlert(msg, title, button, callback)
{
	title = typeof title !== 'undefined' ? title : "";
	
	if($.mobile)
	{
		navigator.notification.alert(msg, callback, title, button);
	}
	else
	{
		alert(title+"\n"+msg);
		if (typeof(callback) == 'function') callback(msg);
	}
}

function noticeToast(msg, position, duration)
{
	// center | top | bottom
	position = typeof position !== 'undefined' ? position : "center";
	// long | short
	duration = typeof duration !== 'undefined' ? duration : "short";
	
	if($.mobile)  window.plugins.toast.show(msg, duration, position);
}

function spinnerShow()
{
	//if($.mobile) spinnerplugin.show();
}
function spinnerHide()
{
	//if($.mobile) spinnerplugin.hide();
}