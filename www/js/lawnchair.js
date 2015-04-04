// create a heroes collection
var heroes;

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
		
		window.plugins.toast.showShortTop('device ready');
		
		heroes = Lawnchair({name:'heroes'}, function(e) {});

		window.plugins.toast.showShortTop('lawnchair initiated');
		
		$('#btnCreateList').click(function(e) {
			window.plugins.toast.showShortTop('createList() called');
			createList();
			e.preventDefault();
		});
		
		$('#btnSelectList').click(function(e) {
			window.plugins.toast.showShortTop('selectList() called')
			selectList();
			e.preventDefault();
		});
		
		
		$('#btnFilterList').click(function(e) {
			window.plugins.toast.showShortTop('filterList() called')
			filterList();
			e.preventDefault();
		});
		
		$('#btnFindOne').click(function(e) {
			window.plugins.toast.showShortTop('findOne() called')
			findOne();
			e.preventDefault();
		});
		
		$('#btnRemoveOne').click(function(e) {
			window.plugins.toast.showShortTop('removeOne() called')
			removeOne();
			e.preventDefault();
		});
		
		$('#btnClearList').click(function(e) {
			window.plugins.toast.showShortTop('clearList() called')
			clearList();
			e.preventDefault();
		});
    }
};


function createList()
{
	heroes.save({code:"batman", name:'Batman', publisher:'dc', city:'Gotham City', person:'Bruce Wayne'});
	heroes.save({code:"superman", name:'Superman', publisher:'dc', city:'Metropolis', person:'Clark Kent'});
	heroes.save({code:"flash", name:'Flash', publisher:'dc', city:'Central City', person:'Barry Allen'});
	heroes.save({code:"arrow", name:'Arrow', publisher:'dc', city:'Starling City', person:'Oliver Queen'});
	heroes.save({code:"ironman", name:'Ironman', publisher:'marvel', city:'New York City', person:'Tony Stark'});
	heroes.save({code:"spiderman", name:'Spiderman', publisher:'marvel', city:'New York City', person:'Peter Parker'});
	heroes.save({code:"hulk", name:'The Hulk', publisher:'marvel', city:'New York City', person:'Robert Bruce Banner'});
	heroes.save({code:"wolverine", name:'Wolvorine', publisher:'marvel', city:'Salem Center', person:'Logan'});
	heroes.save({code:"exiang", name:'eXiang the programmer', publisher:'yeesiang.com', city:'Cyberjaya', person:'Tan Yee Siang'});
}

function selectList()
{
	heroes.all( function(results) {
		$('#output').html("");
		$.each(results, function(i, data) {
			var recordHtml = '  - '+data.name+' ('+data.person+') from '+data.publisher+' and is based in '+data.city+"\n";
			$('#output').append(recordHtml);
		});
	});
}

function filterList()
{
	heroes.where('record.publisher=="marvel" && record.city=="New York City"', function(results) {
		$('#output').html("");
		$.each(results, function(i, data) {
			$('#output').append(data.name+' ('+data.person+') from '+data.publisher+' and is based in '+data.city+"\n");
		});
	});
}
	
function clearList()
{
	heroes.nuke();
	$('#output').html("db collection cleared");
}

function findOne()
{
	$('#output').html("\n\is exiang record exists?\n");
	var exiangFound = false;
	var exiangKey = '';
	heroes.where('record.code=="exiang"', function(results) {
		$.each(results, function(i, data) {
			exiangFound = true;
			exiangKey = data.key;
		});
	});
	(exiangFound) ? $('#output').append("exiang record found...\n") : $('#output').append("exiang record not found!\n")
	
	if(exiangFound)
	{
		$('#output').append("\n\nGet exiang record:\n");
		heroes.get(exiangKey, function(obj) {
			$('#output').append("  -"+obj.name+"\n");
			$('#output').append("  -"+obj.city+"\n");
			$('#output').append("  -"+obj.person+"\n")
		});
	}
}

function removeOne()
{
	$('#output').html("\n\Remove wolverine record:\n");
	heroes.where('record.code=="wolverine"', function(results) {
		$.each(results, function(i, data) {
			heroes.remove(data.key, function() {
				$('#output').append("wolverine record has been removed...\n")
			})
		});
	});
}