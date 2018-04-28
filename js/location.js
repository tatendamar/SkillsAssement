/*
 * Local Venue Search using Foursquare api and Google Maps
 * Author: Tatenda Marufu
 */


$(function() {
	let lat = "";
  let lng = "";
	let appendhtml = "";



	$("#search").click(function(){
		$(this).val("");
	});

	//blur the placeholder info
	$("#search").blur(function(){
		if ($(this).val() === "") {
			$(this).val("Eg: Food");
		}

		if ($(this).val() !== "Eg: Food") {
			$(this).addClass("focus");
		} else {
			$(this).removeClass("focus");
		}
	});

	$("#sform").submit(function(evt){
		evt.preventDefault();
		if (!lat) {
			navigator.geolocation.getCurrentPosition(getLocation);
		} else {
			getLoc();
		}
	});

	function getLocation(location) {
	    lat = location.coords.latitude;
	    lng = location.coords.longitude;
		getLoc();
	}

	function getLoc() {
		//Get venues
		$.ajax({
	  		type: "GET",
	  	  url: 'https://api.foursquare.com/v2/venues/search?ll='+lat+','+lng+'&limit=10&client_id=IF0ZQE4JNYCYYT5OOLW5T4V5AU5I2ZBG4YRSMPKCW2QASQJL&client_secret=LREHGTLS3VUSMGBQ5CIBBISE1KQB4KADNXPLTX11A2ZTIFMQ&v=20130619',
	  		success: function(data) {
				$("#locations").show();
		  	var venue = data.response.venues;
				$("#locations").html("");

				//Build the map using data.
				const myOptions = {
					zoom:11,
					center: new google.maps.LatLng(lat,lng-.2),
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					panControl: false
				},
				map = new google.maps.Map(document.getElementById('map'), myOptions);

				// Loop through the dataobj
		    for(var i = 0; i < venue.length; i++){
						appendhtml = '<div class="venue"><h2><span>'+venue[i].name+'<br />'+'<img class="icon" src="'+ venue[i].categories[0].icon.prefix +'bg_88'+venue[i].categories[0].icon.suffix +'"></p><p><strong>Total Checkins:</strong> '+venue[i].stats.checkinsCount+'</p></div>';
						$("#locations").append(appendhtml);

						//Create markers
								const markerImage = {
								url: './images/pin2.png',
								scaledSize: new google.maps.Size(24, 24),
								origin: new google.maps.Point(0,0),
								anchor: new google.maps.Point(24/2, 24)
								},
								markerOptions = {
								map: map,
								position: new google.maps.LatLng(venue[i].location.lat, venue[i].location.lng),
								title: venue[i].name,
								animation: google.maps.Animation.DROP,
								icon: markerImage,
								optimized: false
								},
								marker = new google.maps.Marker(markerOptions)

							}
						}
					});
				}


         //Build map
				function mapbuild() {
					$("#locations").hide();
					var myOptions = {
					zoom:5,
					center: new google.maps.LatLng(38.962612,-99.080879),
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					panControl: false
					},
					map = new google.maps.Map(document.getElementById('map'), myOptions);
				}
				mapbuild();

			});
