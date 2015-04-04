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
		
		$('#btnFire1').attr('disabled','disabled');
		cordova.plugins.notification.local.registerPermission(function (granted) {
			$('#btnFire1').removeAttr('disabled');
		});
			
		$('#btnFire1').click(function(e) {
			cordova.plugins.notification.local.schedule({
				id: 1,
				title: "Notification #1",
				message: "subtext goes here...",
				data: { param1:"abc", param2:"def" }
			});
			e.preventDefault();
		});
		
		
		$('#btnFire2').attr('disabled','disabled');
		/*$('#btnFire2').click(function(e) {
			cordova.plugins.notification.local.schedule({
				id: 2,
				title: "Notification #2 (repeat)",
				text: "This msg automatically display every minute.",
				every: 'minute',
				data: { param1:"abc", param2:"def", counter：1}
			});
			e.preventDefault();
		});*/
		
		
		$('#btnFire3').attr('disabled','disabled');
		cordova.plugins.notification.local.registerPermission(function (granted) {
			$('#btnFire3').removeAttr('disabled');
		});
		$('#btnFire3').click(function(e) {
			cordova.plugins.notification.local.schedule({
				id: 3,
				title: "Notification #3",
				message: "click and go back to home",
				data: { param1:"abc", param2:"def" }
			});
			e.preventDefault();
		});
			
		$('#btnFire4').attr('disabled','disabled');
		cordova.plugins.notification.local.registerPermission(function (granted) {
			$('#btnFire4').removeAttr('disabled');
		});
		$('#btnFire4').click(function(e) {
			var now = new Date().getTime();
			var _10_sec_from_now = new Date(now + 10*1000);
			
			cordova.plugins.notification.local.schedule({
				id: 4,
				title: "Notification #4",
				message: "this message was delayed for 10 second",
				at: _10_sec_from_now,
				data: { param1:"abc", param2:"def" }
			});
			e.preventDefault();
		});
			
		cordova.plugins.notification.local.on("click", function (notification) {
			if (notification.id == 1) {
				window.plugins.toast.showShortTop('You have just read the Notification #1: '+notification.message+" (param1:"+notification.data.param1+")");
			}
			else if (notification.id == 3) {
				window.plugins.toast.showShortTop('You have just read the Notification #3: '+notification.message+" (param1:"+notification.data.param1+")");
				// goto home
				window.location = "home.html";
			}
		});
		
		cordova.plugins.notification.local.on("trigger", function (notification) {
			/*if (notification.id == 2)
			{
				var newCounter = notification.data.counter+1;
				cordova.plugins.notification.local.update({
					text: "This msg automatically display every minute. Counter: "+notification.data.counter,
					data: {params1:notification.data.params1, params2:notification.data.params2, counter:newCounter }
				});
			}*/
		});
		
		cordova.plugins.notification.local.on("clearall", function (state) {
			if (state == "background") 
			{    
				window.plugins.toast.showShortTop("Notification center cleared from outside");
			}
			else
			{
				window.plugins.toast.showShortTop("Notification cleared");
			}
			
		});
    }
};