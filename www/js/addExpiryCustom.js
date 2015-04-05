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


function uiInit()
{
	trace("call uiInit()");
	
	selectedCategoryId = getLocalStorage('addExpiryCategoryId');
	selectedCategory = getLocalStorage('addExpiryCategory');
	
	$('#input-categoryName').val(selectedCategory.title);
	
	
	// cancel adding, back to addExpiry page
	$('#btnExpiryCustomCancel').click(function(e) {			
		go('addExpiry');
		e.preventDefault();
	});
}

function pageInit()
{
	trace("call pageInit()");
	
	$('#btnGetImageUrl').click(function(e) {			
		navigator.camera.getPicture(onSuccessUrl, onFail, { correctOrientation:true, quality:50, destinationType:Camera.DestinationType.FILE_URI });
		e.preventDefault();
	});
	
	// add item to database
	$('#btnExpiryCustomSubmit').click(function(e) {			
		e.preventDefault();
		
		// check required field have input
		if($('#input-itemName').val().length<1)
		{
			noticeAlert("Please insert required data to proceed");
			return;
		}
		
		// all required data is filled in d
		var title = $('#input-itemName').val();
		var category_id = selectedCategoryId;
		var image_main = $('#canvasPreview').attr('src');
		addCustomItem(title, category_id, image_main, function(e){go("addExpiry");});
	});	
}

function onSuccessUrl(imageURI) {
	//var image = document.getElementById('canvasPreview');
	//image.src = imageURI;
	$('#canvasPreview').attr('src', imageURI);
}

function onFail(message)
{
	noticeAlert('Failed: ' + message);
}