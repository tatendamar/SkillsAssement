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
		// the first ajax request returns the venueId
		$.ajax({
	  		type: "GET",
	  	  url: 'https://api.foursquare.com/v2/venues/search?ll='+lat+','+lng+'&limit=20&client_id=CLIENT-ID&client_secret=CLIENT-SECRET&v=20130619',
	  		success: function(data1) {
					var venue1 = data1.response.venues;
           for(x in venue1){
						 //this ajax request returns the specific photos of the location
					$.ajax({
					dataType: 'jsonp',
					type: 'GET',
					url: 'https://api.foursquare.com/v2/venues/'+ venue1[x].id+'/photos?&oauth_token=AUTH-TOKEN&limit=10&v=20130619',
					success: function(data){
		   		$("#locations").show();
	    	 var venue = data.response.photos.items;
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
		    for(i in venue){
						appendhtml = '<div class="venue"><h2><span>'+data1.response.venues[0].name+'<br />'+'<img src="'+ venue[i].prefix +'300x300'+venue[i].suffix +'"></div>';
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
								position: new google.maps.LatLng(data1.response.venues[0].location.lat, data1.response.venues[0].location.lng),
								title: venue[i].name,
								animation: google.maps.Animation.DROP,
								icon: markerImage,
								optimized: false
								},
								marker = new google.maps.Marker(markerOptions);
					  		}
					    	}
			    	  })
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
