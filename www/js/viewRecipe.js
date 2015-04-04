var viewRecipeItemId = '';
var viewRecipeItem = '';

var viewRecipeId = "";
var viewRecipe = "";

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
        gInit();
		pageInit();
    }
};

function renderRecipe(data)
{
	var recipe = data[0];
	
	$('#viewRecipePreview').attr('src', getImageUrl(recipe.image_photo));
	$('#viewRecipeTitle').html(recipe.title);
	$('#viewRecipeContent pre').html(recipe.html_content);
}

function uiInit()
{
	trace("call uiInit()");
	viewRecipeItemId = getLocalStorage('viewRecipeItemId');
	viewRecipeItem = getItemById(viewRecipeItemId);
	
	getRemoteRecipeByItem(viewRecipeItemId, renderRecipe);
}

function pageInit()
{
	trace("call pageInit()");
	
	// noticeToast("viewRecipeItemId: "+viewRecipeItemId);
}