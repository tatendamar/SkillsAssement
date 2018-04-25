/*
 * Local Venue Search using Foursquare api and Google Maps
 * Author: Tatenda Marufu
 */


$(function() {
	let lat = "";
  let lng = "";
	let appendhtml = "";
	let str = "";
	let newstr = "";
	let phone = "";
	let rating = "";
	let icon = "";
	let address = "";

	

	$("#search").click(function(){
		$(this).val("");
	});

	//blur the placeholder info
	$("#search").blur(function(){
		if ($(this).val() == "") {
			$(this).val("Eg: Food");
		}

		if ($(this).val() != "Eg: Food") {
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
	  		url: "https://api.foursquare.com/v2/venues/explore?ll="+lat+","+lng+"&client_id=IF0ZQE4JNYCYYT5OOLW5T4V5AU5I2ZBG4YRSMPKCW2QASQJL&client_secret=LREHGTLS3VUSMGBQ5CIBBISE1KQB4KADNXPLTX11A2ZTIFMQ&v=20130619&query="+$("#search").val()+"",
	  		success: function(data) {
				$("#locations").show();
				var dataobj = data.response.groups[0].items;
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
				$.each(dataobj, function() {
					if (this.venue.categories[0]) {
							str = this.venue.categories[0].icon.prefix;
							newstr = str.substring(0, str.length - 1);
							icon = newstr+this.venue.categories[0].icon.suffix;
						} else {
							icon = "";
						}

						if (this.venue.contact.formattedPhone) {
							phone = "Phone:"+this.venue.contact.formattedPhone;
						} else {
							phone = "";
						}

						if (this.venue.location.address) {
							address = '<p class="subinfo">'+this.venue.location.address+'<br>';
						} else {
							address = "";
						}

						if (this.venue.rating) {
							rating = '<span class="rating">'+this.venue.rating+'</span>';
						}

						appendhtml = '<div class="venue"><h2><span>'+this.venue.name+'<img class="icon" src="'+icon+'"> '+rating+'</span></h2>'+address+phone+'</p><p><strong>Total Checkins:</strong> '+this.venue.stats.checkinsCount+'</p></div>';
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
								position: new google.maps.LatLng(this.venue.location.lat, this.venue.location.lng),
								title: this.venue.name,
								animation: google.maps.Animation.DROP,
								icon: markerImage,
								optimized: false
								},
								marker = new google.maps.Marker(markerOptions)

							});
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
