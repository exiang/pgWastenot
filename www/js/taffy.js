// create a heroes collection
// http://www.taffydb.com/
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
		
		heroes = TAFFY();

		window.plugins.toast.showShortTop('taffy initiated');
		
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
	heroes.insert({code:"batman", name:'Batman', publisher:'dc', city:'Gotham City', person:'Bruce Wayne'});
	heroes.insert({code:"superman", name:'Superman', publisher:'dc', city:'Metropolis', person:'Clark Kent'});
	heroes.insert({code:"flash", name:'Flash', publisher:'dc', city:'Central City', person:'Barry Allen'});
	heroes.insert({code:"arrow", name:'Arrow', publisher:'dc', city:'Starling City', person:'Oliver Queen'});
	heroes.insert({code:"ironman", name:'Ironman', publisher:'marvel', city:'New York City', person:'Tony Stark'});
	heroes.insert({code:"spiderman", name:'Spiderman', publisher:'marvel', city:'New York City', person:'Peter Parker'});
	heroes.insert({code:"hulk", name:'The Hulk', publisher:'marvel', city:'New York City', person:'Robert Bruce Banner'});
	heroes.insert({code:"wolverine", name:'Wolvorine', publisher:'marvel', city:'Salem Center', person:'Logan'});
	heroes.insert({code:"exiang", name:'eXiang the programmer', publisher:'yeesiang.com', city:'Cyberjaya', person:'Tan Yee Siang'});
}

function selectList()
{
	$('#output').html("");
	heroes().each(function (data) {
		$('#output').append(data.name+' ('+data.person+') from '+data.publisher+' and is based in '+data.city+"\n");
	});
}

function filterList()
{
	$('#output').html("");
	$('#output').append("\n\nFind records from marvel and is in New York City:\n");
	heroes({publisher:"marvel", city:"New York City"}).each(function(data){
		$('#output').append(data.name+' ('+data.person+') from '+data.publisher+' and is based in '+data.city+"\n");
	});
}
	
function clearList()
{
	heroes().remove();
	$('#output').html("db collection cleared");
}

function findOne()
{
	$('#output').html("\n\is exiang record exists?\n");
	(heroes({code:"exiang"}).count()>0) ? $('#output').append("exiang record found...\n") : $('#output').append("exiang record not found!\n")
	if(heroes({code:"exiang"}).count()>0)
	{
		var obj = heroes({code:"exiang"}).first();
		$('#output').append("\n\nGet exiang record:\n");
		$('#output').append(obj.name+"\n");
		$('#output').append(obj.city+"\n");
		$('#output').append(obj.person+"\n")
	}
}

function removeOne()
{
	$('#output').html("\n\Remove wolverine record:\n");
	if(heroes({code:"wolverine"}).remove()) $('#output').append("wolverine record has been removed...\n");
}