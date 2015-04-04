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
		$('#btnDialogAlert').click(function(e) {
			navigator.notification.alert("This is an alert message", onAlertDismissed, "Custom Alert Title", "Sure!")
			e.preventDefault();
		});
		$('#btnDialogConfirm').click(function(e) {
			navigator.notification.confirm(
				'Please select a pill!', // message
				 onConfirm,            // callback to invoke with index of button pressed
				'Morpheus Said',           // title
				['1-Blue', '2-Red']     // buttonLabels
			);
			e.preventDefault();
		});
		$('#btnDialogPrompt').click(function(e) {
			navigator.notification.prompt(
				'Please enter your name',  // message
				onPrompt,                  // callback to invoke
				'Registration',            // title
				['Ok','Exit'],             // buttonLabels
				'Allen Tan'                 // defaultText
			);
			e.preventDefault();
		});
		$('#btnDialogBeep').click(function(e) {
			navigator.notification.beep(3);
			e.preventDefault();
		});
    }
};

function onAlertDismissed() {
    // do something
	window.plugins.toast.showLongBottom('Alert dismissed!')
}

function onConfirm(buttonIndex) {
    window.plugins.toast.showLongBottom('You selected pill ' + buttonIndex);
}

function onPrompt(results) {
    window.plugins.toast.showLongBottom("You selected button number " + results.buttonIndex + " and entered " + results.input1);
}