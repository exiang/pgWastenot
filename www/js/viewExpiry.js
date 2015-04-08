var viewExpiryId = '';
var viewExpiryItem = '';

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

function renderExpiryItem(data)
{
	trace("call renderExpiryItem()");
	
	$('#viewExpiryPreview').attr('src', getImageUrl(data.image_main));
	$('#viewExpiryTitle').html(data.title);
	$('#viewExpiryExpiredIn').html(daysFromNow(data.year_expired, data.month_expired, data.day_expired) + " day(s)");
	$('#viewExpiryExpiredInDetail').html(data.year_expired+" "+getMonthName(data.month_expired-1)+" "+data.day_expired);
	//console.log(data.id);
	$('#btnViewRecipe').attr('data-itemId', data.item_id);
	//alert($('#btnViewRecipe').attr('data-itemId'))
	
	$( "#btnViewRecipe" ).click(function() {
		go('viewRecipe', {'viewRecipeItemId':$(this).attr('data-itemId')});
	});
	
	countRemoteRecipeByItem(data.item_id, function(data){
		var total = parseInt(data);
		if(total < 1)
		{
			$('#btnViewRecipe').hide();
		}
	});
	
	viewExpiryItem = data;
}


function uiInit()
{
	trace("call uiInit()");
	
	viewExpiryId = getLocalStorage('viewExpiryId');
	getExpiryById(viewExpiryId, renderExpiryItem);
}


function pageInit()
{
	trace("call pageInit()");	
	
	$('#btnShare').on('click', function(e){
		var title = "WasteNot"
		var dayFromNow = daysFromNow(viewExpiryItem.year_expired, viewExpiryItem.month_expired, viewExpiryItem.day_expired);
		var msg = 'My '+viewExpiryItem.title + ' expiring in '+dayFromNow+' days.';
		if(dayFromNow == 0)
		{
			msg = 'My '+viewExpiryItem.title + ' expired in today.';
		}
		else if(dayFromNow == 1)
		{
			msg = 'My '+viewExpiryItem.title + ' expiring in '+dayFromNow+' day.';
		}
		
		window.plugins.socialsharing.share(
			msg, title, getImageUrl(viewExpiryItem.image_main)
		);
	});
	
}