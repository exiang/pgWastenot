var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
		// disable back button on android
		document.addEventListener("backbutton", function (e) {
            e.preventDefault();
        }, false );
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
        if(!$.isGInited) gInit();
		pageInit();
    }
};

function renderToday(data)
{
	trace("call renderToday()");
	$('#expiryInDay-0').html('');
	$.each(data, function(index, obj ) {
		var html = '<div class="col-xs-4 col-sm-3 col-md-2"><a href="" class="thumbnail" data-id="'+obj.id+'">'+
			'<img src="'+getImageUrl(obj.image_main)+'" />'+
			'<p>'+obj.title+'</p></a></div>';
		
		$('#expiryInDay-0').append(html);
	});
}

function renderTomorrow(data)
{
	trace("call renderTomorrow()");
	$('#expiryInDay-1').html('');
	$.each(data, function(index, obj ) {
		var html = '<div class="col-xs-4 col-sm-3 col-md-2"><a href="" class="thumbnail" data-id="'+obj.id+'">'+
			'<img src="'+getImageUrl(obj.image_main)+'" />'+
			'<p>'+obj.title+'</p></a></div>';
		
		$('#expiryInDay-1').append(html);
	});
}

function renderAfterTomorrow(data)
{
	trace("call renderAfterTomorrow()");
	$('#expiryInDay-2').html('');
	$.each(data, function(index, obj ) {
		var html = '<div class="col-xs-4 col-sm-3 col-md-2"><a href="" class="thumbnail" data-id="'+obj.id+'">'+
			'<img src="'+getImageUrl(obj.image_main)+'" />'+
			'<p>'+obj.title+'</p></a></div>';
		
		$('#expiryInDay-2').append(html);
	});
}

function renderAfter3Days(data)
{
	trace("call renderAfter3Days()");
	$('#expiryInDay-3').html('');
	$.each(data, function(index, obj ) {
		var html = '<div class="col-xs-4 col-sm-3 col-md-2"><a href="" class="thumbnail" data-id="'+obj.id+'">'+
			'<img src="'+getImageUrl(obj.image_main)+'" />'+
			'<p>'+obj.title+'</p></a></div>';
		
		$('#expiryInDay-3').append(html);
	});
}

function renderAfter4Days(data)
{
	trace("call renderAfter4Days()");
	$('#expiryInDay-4').html('');
	$.each(data, function(index, obj ) {
		var html = '<div class="col-xs-4 col-sm-3 col-md-2"><a href="" class="thumbnail" data-id="'+obj.id+'">'+
			'<img src="'+getImageUrl(obj.image_main)+'" />'+
			'<p>'+obj.title+'</p></a></div>';
		
		$('#expiryInDay-4').append(html);
	});
}

function renderAfter5Days(data)
{
	trace("call renderAfter5Days()");
	$('#expiryInDay-5').html('');
	$.each(data, function(index, obj ) {
		var html = '<div class="col-xs-4 col-sm-3 col-md-2"><a href="" class="thumbnail" data-id="'+obj.id+'">'+
			'<img src="'+getImageUrl(obj.image_main)+'" />'+
			'<p>'+obj.title+'</p></a></div>';
		
		$('#expiryInDay-5').append(html);
	});
}

function uiInit()
{
	trace("call uiInit()");
	
	getRemoteItemList();
	
	// year month day
	var todayPart = futureDate2part(0);
	var tomorrowPart = futureDate2part(1);
	var afterTomorrowPart = futureDate2part(2);
	var after3DaysPart = futureDate2part(3);
	var after4DaysPart = futureDate2part(4);
	var after5DaysPart = futureDate2part(5);
	//console.log(tomorrowPart);
	//console.log(futureDate2part(1));
	
	getExpiryByDate(todayPart[0], todayPart[1], todayPart[2], renderToday)
	getExpiryByDate(tomorrowPart[0], tomorrowPart[1], tomorrowPart[2], renderTomorrow)
	getExpiryByDate(afterTomorrowPart[0], afterTomorrowPart[1], afterTomorrowPart[2], renderAfterTomorrow)
	getExpiryByDate(after3DaysPart[0], after3DaysPart[1], after3DaysPart[2], renderAfter3Days)
	getExpiryByDate(after4DaysPart[0], after4DaysPart[1], after4DaysPart[2], renderAfter4Days)
	getExpiryByDate(after5DaysPart[0], after5DaysPart[1], after5DaysPart[2], renderAfter5Days)
	
	$('.expiryInDayList').on('click', '.thumbnail', function(e){
		go('viewExpiry', {'viewExpiryId':$(this).data('id')});
		e.preventDefault();
	});
	
	// get total of items expired on that day
	//countExpiryByDate(2015,4,5,function(count){alert(count);})
	
}

function pageInit()
{
	trace("call pageInit()");
}