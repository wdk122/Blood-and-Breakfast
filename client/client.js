
// //TODO: need methods to update icons per marker based on:
//   //TYPE: bus or stop
//   //CONDITION: redness v greeness. (slots are likely only shown in popup);

// Meteor.subscribe('stops');
// Meteor.subscribe('markers');
// Meteor.subscribe('routes');
// Meteor.subscribe('players');
// Meteor.startup(function() {
//   theMap = GoogleMaps.load();
// });

// stylesArray =
//   [
//     {
//       featureType: 'all',
//       elementType: 'geometry',
//       stylers: [
//         { "visibility": "on" },
//         { "hue": "#0000ff" },
//         { "weight": 0.5 },
//         { "gamma": 0.31 },
//         { "saturation": 100 },
//         { "lightness": -7 }
//       ]
//     },
//     {
//       featureType: 'road',
//       elementType: 'geometry',
//       stylers: [
//         { "visibility": "on" },
//         { "hue": "#0000ff" },
//         { "weight": 0.75 },
//         { "gamma": 0.31 },
//         { "saturation": 100 },
//         { "lightness": -7 }
//       ]
//     },
//     {
//       featureType: 'all',
//       elementType: 'labels',
//        "stylers": [
//         { "visibility": "off" },
//         { "hue": "#000000" },
//         { "weight": 0.75 },
//         { "gamma": 0.31 },
//         { "saturation": 100 },
//         { "lightness": -7 }
//       ]
//     }
//   ];

//   var setMapStyleToTeam = function(){

//     var hue = "#ff0000";
//     if(Session.get("isZombie")){
//       hue = "#00ff00";
//     }

//     stylesArray[0].stylers[1].hue = hue;
//     stylesArray[1].stylers[1].hue = hue;
//     stylesArray[2].stylers[1].hue = hue;
//     if(theMap){
//       theMap.setOptions({styles: stylesArray});
//     }

//   }

// Template.map.helpers({
//   mapOptions: function() {
//     console.log("MAP OPTIONS");
//     setMapStyleToTeam();
//     if (GoogleMaps.loaded()) {
//       return {
//         center: new google.maps.LatLng(37.7577, -122.4376), //approx. center of SF
//         zoom: 15,
//         styles: stylesArray,
//         disableDefaultUI: true,
//         disableDoubleClickZoom: true,
//         keyboardShortcuts: false,
//         //draggableCursor: "path",
//         minZoom: 12,
//         //maxZoom: 12,
//         //noClear: true,
//         overviewMapControl: false,
//         mapTypeControlOptions: {}
//       };
//     }
//   }
// });
// /*var busStops;
// // adds markers
// var addBusStops = function(geolocation){
//   var latGT = parseFloat(geolocation.lat) - 0.005;
//   var latLT = parseFloat(geolocation.lat) + 0.005;
//   var lonGT = parseFloat(geolocation.lon) - 0.005;
//   var lonLT = parseFloat(geolocation.lon) + 0.005;
//   //Markers.remove({});
//   if (busStops) {
//     for (var i = 0; i < busStops.length; i++){
//       Markers.remove(busStops[i]._id);
//     }
//   }
//   busStops = Stops.find({'lat': {$gt: latGT, $lt: latLT}, 'lon': {$gt: lonGT, $lt: lonLT}}).fetch();
//   //finds all bustops and add them to Markers collection
//   //var busStops = Stops.find({}).fetch();
//   var stop;
//   //Markers.insert({ lat: 37.7833, lng: -122.4167, icon: "./blue-bus-stop.png" }); //this is a test line of code with which you can explore marker options
//   var count = 0;
//   for(var i = 0; i < busStops.length; i++){
//     //console.log("Stop Count", count++);
//     stop = busStops[i];
//     if (!Markers.findOne({lat: stop.lat, lng: stop.lon})) {
//       //if busStop is Zombie; icon = "/.zombie-busStop.png"
//       //if busStop is Vampires; icon = "/.vampires-busStop.png"
//       Markers.insert({
//         _id: stop._id,
//         lat: stop.lat,
//         lng: stop.lon,
//         icon: "./blue-bus-stop.png"
//       });
//     }
//   }
// };*/

// Template.map.onCreated(function() {

//   GoogleMaps.ready('map', function(map) {

//     //Session.set('map', map);

//     //Markers.insert({ lat: 37.92745749, lng: -122.30918959999998, animation: google.maps.Animation.BOUNCE, icon: }); //this is a test line of code with which you can explore marker options

//     // the code below automatically detects changes in the Markers mongo collection and updates the map accordingly.  property values from
//     // the collection can be referred to so that look and behavior can be customized based on properties of the data point
    
//     //creates a draggable marker at the center of the map on load
//     var draggableMarker = new google.maps.Marker({
//       draggable: true,
//       position: new google.maps.LatLng(37.7577,-122.4376),
//       map: map.instance,
//       title: "Your fake location",
//      // icon: //can change depending on team 
//     });
    
//     //gets the draggable marker's position when done dragging
//     google.maps.event.addListener(draggableMarker, 'dragend', function (event) {
//       var playerLat = this.getPosition().lat();
//       var playerLng = this.getPosition().lng();
//       console.log("The draggableMarker's position is: ", playerLat, playerLng);
//       //stores the marker's position in a session AVAILAIBLE FOR USE EVERYWHERE
//       Session.set('fakePosition', {lat: playerLat, lon: playerLng});
//       addBusStops(Session.get('fakePosition'));
//     });

//     var markers = {};

//     Markers.find().observe({
//       added: function(document) {
//         // Create a marker for this document
//         var marker = new google.maps.Marker({
//           // a plethora of key value pair options can be found at the google maps api website with which markers can be customized ad nauseum
//           animation: document.animation || google.maps.Animation.DROP,
//           icon: document.icon, //<- we can use this option when we want to customize our icons
//           position: new google.maps.LatLng(document.lat, document.lng),
//           map: map.instance,
//           id: document._id
//         });

//         // Store this marker instance within the markers object.
//         markers[document._id] = marker;
//       },
//       changed: function(newDocument, oldDocument) {
//         markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
//       },
//       removed: function(oldDocument) {
//         // Remove the marker from the map
//         markers[oldDocument._id].setMap(null);

//         // Clear the event listener
//         google.maps.event.clearInstanceListeners(
//           markers[oldDocument._id]);

//         // Remove the reference to this marker instance
//         delete markers[oldDocument._id];
//       }
//     });
//   });
// });

// //TODO: make this do something
// //query db for all stops and buses within n distance of player
// //set bite button timer on client and server
// //disable bit button until timer resets
// /*var infectArea = function(teamName){
//   var loc = playerLoc;
//   var team = teamName;
//   var id = Meteor._id;

// };*/

// //passing true will return an object with floats
// //not passing true will return a string of coords
// var playerLoc = function(asVals){
//   var loc = Geolocation.currentLocation();
//   if(!loc) return "";
//   var locX = loc.coords.latitude;
//   var locY = loc.coords.longitude;
//   if(asVals){
//     return {lon: locX, lat: locY};
//   }

//   return "" + locX + "," + locY;
// };

// Template.registerHelper("playerLoc", function(){
//   return playerLoc();
// });

// Template.registerHelper("addBusStops", function(){
//   return addBusStops();
// });