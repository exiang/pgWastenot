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
}

function pageInit()
{
	trace("call pageInit()");
	
	$('#btnDialogAlert').click(function(e) {
		noticeAlert("This is an alert message", "Hello World", "Alright", '');
		e.preventDefault();
	});
	
	$('#btnToast').click(function(e) {
		noticeToast("This is a toast message")
		e.preventDefault();
	});
}