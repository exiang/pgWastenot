// https://github.com/brodysoft/Cordova-SQLitePlugin/blob/7e62177/README.md
// http://stackoverflow.com/questions/19570868/storage-of-sqlite-database-using-android-and-phonegap/25518453#25518453
// cordova plugin add https://github.com/brodysoft/Cordova-SQLitePlugin
var db;

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
		
		db = window.sqlitePlugin.openDatabase({name: "heroes.db", location: 1});
		db.transaction(function(tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS heroes (id integer primary key, code text, name text, publisher text, city text, person text)');
		});
		window.plugins.toast.showShortTop('sqlite db initiated');
		
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
	db.transaction(function(tx) {
		tx.executeSql("INSERT INTO heroes (code, name, publisher, city, person) VALUES (?,?,?,?,?)", ["batman", "Batman", "dc", "Gotham City", "Bruce Wayne"]);
		tx.executeSql("INSERT INTO heroes (code, name, publisher, city, person) VALUES (?,?,?,?,?)", ["superman", "Superman", "dc", "Metropolis", "Clark Kent"]);
		tx.executeSql("INSERT INTO heroes (code, name, publisher, city, person) VALUES (?,?,?,?,?)", ["flash", "Flash", "dc", "Central City", "Barry Allen"]);
		tx.executeSql("INSERT INTO heroes (code, name, publisher, city, person) VALUES (?,?,?,?,?)", ["arrow", "Arrow", "dc", "Starling City", "Oliver Queen"]);
		tx.executeSql("INSERT INTO heroes (code, name, publisher, city, person) VALUES (?,?,?,?,?)", ["ironman", "Ironman", "marvel", "New York City", "Tony Stark"]);
		tx.executeSql("INSERT INTO heroes (code, name, publisher, city, person) VALUES (?,?,?,?,?)", ["spiderman", "Spiderman", "marvel", "New York City", "Peter Parker"]);
		tx.executeSql("INSERT INTO heroes (code, name, publisher, city, person) VALUES (?,?,?,?,?)", ["hulk", "The Hulk", "marvel", "New York City", "Robert Bruce Banner"]);
		tx.executeSql("INSERT INTO heroes (code, name, publisher, city, person) VALUES (?,?,?,?,?)", ["wolverine", "Wolvorine", "marvel", "Salem Center", "Logan"]);
		tx.executeSql("INSERT INTO heroes (code, name, publisher, city, person) VALUES (?,?,?,?,?)", ["wolverine", "eXiang the programmer", "yeesiang.com", "Cyberjaya", "Tan Yee Siang"]);
	});
}

function selectList()
{
	$('#output').html("");
	db.transaction(function(tx) {
		tx.executeSql("select * from heroes;", [], 
		function(tx, results) {
			   for (var i=0 ; i<results.rows.length ; i++)
			   {
					var data = results.rows.item(i);
					$('#output').append(data.id+": "+data.name+' ('+data.person+') from '+data.publisher+' and is based in '+data.city+"\n");
			   }
		}, 
		function(error){
			window.plugins.toast.showShortTop("Error Code " + error.code + " Error Message " + error.message);
		});
	});
	
}

function filterList()
{
	$('#output').html("");
	$('#output').append("\n\nFind records from marvel and is in New York City:\n");
	db.transaction(function(tx) {
		tx.executeSql("select * from heroes WHERE publisher=? AND city=?;", ["marvel", "New York City"], 
		function(tx, results) {
			for (var i=0 ; i<results.rows.length ; i++)
		   {
				var data = results.rows.item(i);
				$('#output').append(data.id+": "+data.name+' ('+data.person+') from '+data.publisher+' and is based in '+data.city+"\n");
		   }
		}, 
		function(error){
			window.plugins.toast.showShortTop("Error Code " + error.code + " Error Message " + error.message);
		});
	});
	
}
	
function clearList()
{
	$('#output').html("db collection cleared"); 
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM heroes");
	});
}

function findOne()
{
	$('#output').html("\n\is exiang record exists?\n");
	
}

function removeOne()
{
	$('#output').html("\n\Remove wolverine record:\n");
	
}