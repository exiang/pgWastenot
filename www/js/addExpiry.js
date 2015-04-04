var selectedCategoryId = '';
var selectedCategory = '';
var selectedItem = '';
var selectedItemId = '';
var selectedExpiryDate = '';

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

function setItemDropdownByCategory(data)
{
	trace("call setItemDropdownByCategory()")
	selectedItemId = data[0].value;
	selectedItem = getItemById(selectedItemId);

	$('#inputAddExpiryItem').mobiscroll().select({
		display: 'modal', data:data,
	});
}

function afterAddedExpiry(expiryId, year, month, day)
{
	trace("call afterAddedExpiry()");
	//console.log(expiryId);
	registerNotif(expiryId, year, month, day, function(expiryId){go('viewExpiry', {'viewExpiryId':expiryId});});
}


function uiInit()
{
	trace("call uiInit()");
	
	// get url params
	selectedCategoryId = getLocalStorage('addExpiryCategoryId');
	selectedCategory = getLocalStorage('addExpiryCategory');
	selectedItem;
	selectedItemId = '';
	selectedExpiryDate = new Date().toUTCString();	
	
	$('#subHeader').html(selectedCategory.title);
	$('#addExpiryPreview').attr('src', getImageUrl(selectedCategory.image_main));
	$('#inputAddExpiryCategory').attr('value', selectedCategory.title).attr('placeholder', '');
	
	// items	
	//console.log(selectedCategory.id);
	getItemsFromDbByCategory(selectedCategoryId, setItemDropdownByCategory);
	$('#inputAddExpiryItem').on('change', function(e){
		var inst = $('#inputAddExpiryItem').mobiscroll('getInst');
		selectedItemId = inst.getVal();
		selectedItem = getItemById(selectedItemId);
		$('#addExpiryPreview').attr('src', getImageUrl(selectedItem.image_main));
	});
	
	 $('#inputAddExpiryDate').mobiscroll().date({
		display: 'modal',
        dateOrder: 'ddMMyy',
        dateFormat: 'dd M yy'
	});
	var tmp = timestamp2part(date2timestamp(selectedExpiryDate));
	$('#inputAddExpiryDate').mobiscroll('setDate', new Date(tmp[0], tmp[1]-1, tmp[2]), true);
	$('#inputAddExpiryDate').on('change', function(e){
		var inst = $('#inputAddExpiryDate').mobiscroll('getInst');
		selectedExpiryDate = inst.getVal();
	});
	
	// change category
	$('#inputAddExpiryCategory').on('click', function(e){
		go('add');
	});
}


function pageInit()
{
	trace("call pageInit()");
	
	// add expiry item
	// involved register notification, need to be call onDeviceReady
	$('#btnAddExpiryRecord').on('click', function(e){
		//alert(selectedCategory.title)
		//alert(selectedItem.title)
		var dateExpiredPart = timestamp2part(date2timestamp(selectedExpiryDate));
		// year, month, day, 24hour, min, second (local time)
		//console.log(tmp)
		
		addExpiry(
			selectedCategory.title, selectedCategoryId, 
			selectedItem.title, selectedItemId, 
			byPriority(selectedItem.image_main, selectedCategory.image_main), 
			dateExpiredPart[0], dateExpiredPart[1], dateExpiredPart[2],
			afterAddedExpiry
		);
	});
	
	
}
