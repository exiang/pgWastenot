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
		$('#btnGetImageData').click(function(e) {			
			navigator.camera.getPicture(onSuccessData, onFail, { correctOrientation:true, quality:50, destinationType:Camera.DestinationType.DATA_URL });
			e.preventDefault();
		});
		
		$('#btnGetImageUrl').click(function(e) {			
			navigator.camera.getPicture(onSuccessUrl, onFail, { correctOrientation:true, quality:50, destinationType:Camera.DestinationType.FILE_URI });
			e.preventDefault();
		});
		
		$('#btnGetImageAlbum').click(function(e) {			
			navigator.camera.getPicture(onSuccessUrl, onFail, { 
				quality:50, 
				destinationType:Camera.DestinationType.FILE_URI, 
				sourceType:Camera.PictureSourceType.SAVEDPHOTOALBUM,
			});
			e.preventDefault();
		});
    }
};

function onSuccessData(imageData) {
	alert('Success');
	//window.plugins.toast.showLongBottom('Image data captured!')
	//image.src = "data:image/jpeg;base64," + imageData;
	//var image = document.getElementById('canvasPreview');
    //image.src = "data:image/jpeg;base64," + imageData
	var image = $('#canvasPreview').attr('src', "data:image/jpeg;base64," + imageData);
}

function onSuccessUrl(imageURI) {
	alert('Success: ' + imageURI);
	//var image = document.getElementById('canvasPreview');
	//image.src = imageURI;
	$('#canvasPreview').attr('src', imageURI);
}

function onFail(message)
{
	alert('Failed: ' + message);
}