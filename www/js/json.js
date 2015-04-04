/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var result = '';
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
		$('#btnLoadFresh').click(function(e) { 
			window.plugins.toast.showShortTop('Load Fresh Button Clicked');
			loadWeather();
			e.preventDefault();
		});
		$('#btnReadCache').click(function(e) { 
			window.plugins.toast.showShortTop('Read Cache Button Clicked');
			readCache();
			e.preventDefault();
		});
		
		//loadWeather();
    }
};
// write
function writeCache()
{
	// this line can be directly replace by fileEntry.createWriter(gotFileWriter, writeFail); for quick mode and skip gotWriteFS() & gotWriteFileEntry()
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotWriteFS, writeFail);
}

function gotWriteFS(fileSystem) {
	fileSystem.root.getFile("weather.cyberjaya.json", {create: true, exclusive: false}, gotWriteFileEntry, writeFail);
}

function gotWriteFileEntry(fileEntry) {
	fileEntry.createWriter(gotFileWriter, writeFail);
}

function gotFileWriter(writer) {
	writer.onwriteend = function(evt) {
		window.plugins.toast.showShortTop('Cache written successfully');
	};
	writer.write(result);
}

function writeFail(error) {
	navigator.notification.alert(error.code);
}

// read
function readCache()
{
	$('#output').html('call readCache()');
	// this line can be directly replace by fileEntry.file(gotFileReader, readFail); for quick mode and skip gotReadFS() & gotReadFileEntry()
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotReadFS, readFail);
}

function gotReadFS(fileSystem) {
	$('#output').html('call gotReadFS()');
	fileSystem.root.getFile("weather.cyberjaya.json", null, gotReadFileEntry, readFail);
}

function gotReadFileEntry(fileEntry) {
	$('#output').html('call gotReadFileEntry()');
	fileEntry.file(gotFileReader, readFail);
}

function gotFileReader(file) {
	$('#output').html('call gotFileReader()');
	
	var reader = new FileReader();
	reader.onloadend = function(evt) {
		$('#output').html('call onloadend()');
		window.plugins.toast.showShortTop('Cache loaded');
		result = JSON.parse(evt.target.result);
		$('#output').html('from cache...<br />'+JSON.stringify(result));
		renderWeather();
	};
	reader.readAsText(file);
}

function readFail(error) {
	navigator.notification.alert(error.code);
}

// load & render
function loadWeather()
{
	spinnerplugin.show();
	var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=cyberjaya,malaysia";
	$.getJSON(apiUrl, function( data ) {
		result = data;
		spinnerplugin.hide();
		
		// write data to file cache
		writeCache();
		
		renderWeather();		
		$('#output').html('from fresh...<br />'+JSON.stringify(result));
	});
}

function renderWeather()
{
	if(result != '')
	{
		window.plugins.toast.showShortTop('rendering result');
		$('#icon').html('<p><img src="http://openweathermap.org/img/w/'+result.weather[0].icon+'.png"/></p>');
		$('#location').html('<p>'+result.name+', '+result.sys.country+'</p>');
		$('#weather').html('<p>'+result.weather[0].description+'</p>');
	}
	else
	{
		navigator.notification.alert("result is not set!");
	}
}
