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
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		$('#btnToastUp').click(function(e) {
			window.plugins.toast.showShortTop('Hello there!', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
			e.preventDefault();
		});
		$('#btnToastBottom').click(function(e) {
			window.plugins.toast.showLongBottom('Hello there!', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)})
			e.preventDefault();
		});
		$('#btnToastCenter').click(function(e) {
			window.plugins.toast.show('Hello there!', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)})
			e.preventDefault();
		});
    }
};
