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


function renderCategoryList()
{
	trace("call renderCategoryList()");
	if($.gCategories.length >0)
	{
		$('#listCategory').html('');		
		$.each($.gCategories, function( index, obj ) {
			var htmlItem = '<div class="list-group">'+
			  '<a href="#" class="list-group-item active" data-code="'+obj.code+'" data-id="'+obj.id+'" data-rid="'+obj.rid+'">'+
				'<img src="'+getImageUrl(obj.image_main)+'" />'+
				'<h4 class="list-group-item-heading">'+obj.title+'</h4>'+
			  '</a>'+
			'</div>';
			$('#listCategory').append(htmlItem);
		});
	}
}

function uiInit()
{
	trace("call uiInit()");
	
	getRemoteCategoryList(renderCategoryList);
	
	$('#listCategory').on('click', '.list-group-item', function(e){
		//console.log($(this).data('id'));
		go('addExpiry', {'addExpiryCategoryId':$(this).data('rid'), 'addExpiryCategory':getCategoryById($(this).data('id'))});
	});
}

function pageInit()
{
	trace("call pageInit()");
}
