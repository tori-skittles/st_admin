var sites_indexed = [];
var map;
var marker;
var markers = [];
function sites_initialize()
{
	console.log('hey');

	$('.page_content_wrapper').html('<div id="" class="col-lg-12" style="padding-right: 0px; padding-bottom: 20px;"><div class="col-lg-10"></div><div class="col-lg-2" style="padding-right: 0px;"><button id="addNewSite" class="btn btn-primary col-lg-12">Add New Site</button></div></div><div id="sites_container"></div>');
	
	$.ajax({
                type: 'GET',
                url: 'http://sciencetap.us/ionic/getSites.php',
                data: {
		},
                dataType: 'json',
                success: function(response){	
			console.log(response.data);	
			sites_indexed = [];
			for( var i = 0; i < response.data.length; i++ )
			{
				sites_indexed[response.data[i].id] = response.data[i];

			}
			displaySites(response.data);
		}

	});
}


function displaySites( sites )
{

	var table_string = "<table id='users_table' class='table table-striped table-bordered table-hover'>";
	table_string = table_string + "<thead><tr><td>Site Name</td><td>Coordinates</td><td>Description</td><td>Created at</td><td>Edit</td></tr></thead><tbody>";

	for( var i = 0; i < sites.length; i++ )
	{
		table_string = table_string + "<tr id='" + sites[i].id + "'><td>" + sites[i].name + "</td><td> ( " + sites[i].lat + "," + sites[i].lon + ") </td><td style='width: 300px;'>" + sites[i].description + "</td><td>" + sites[i].created_at + "</td><td><span class='edit_user' style='text-align: center;'><i class='glyphicon glyphicon-pencil edit_site'></i></span></td></tr>";

	}

	table_string = table_string + "</tbody></table>";
	$('#sites_container').html(table_string);

	$('#addNewSite').click( function(){
		
		initMap('create_site_map', null, null);
		$('#addSiteModal').on("shown.bs.modal", function () {
		    google.maps.event.trigger(map, "resize");
		});

		$('#addSiteModal').modal();
	
		$('#saveAddSite').click( function(){
			var site = {
                                name: $('#add_site_name').val(),
                                description: $('#add_site_description').val(),
                                lat: $('#add_site_lat').val(),
                                lon: $('#add_site_lon').val(),
				projects: []
                        }

                        $.ajax({
                                type: 'POST',
                                url: 'http://sciencetap.us/ionic/editAddUser.php',
                                data: {
                                	name: site.name,
					description: site.description,
					lat: site.lat,
					lon: site.lon,
					projects: []
				},
                                dataType: 'json',
                                success: function(response){    
                                        $('#addSiteModal').modal('hide');      
					sites_initialize();
                                }

                        });
		});
	});

	$('.edit_site').click( function( e ){
		
		var tr = $(e.target).parents('tr');
		var site_uid = $(tr).attr('id');
		var site = sites_indexed[site_uid];

		$('#add_site_name').val(site.name);
		$('#add_site_description').val(site.description);
		$('#add_site_lat').val(site.lat);
		$('#add_site_lon').val(site.lon);

		$('#addSiteModal').on("shown.bs.modal", function () {
                    google.maps.event.trigger(map, "resize");
                });

		$('#addSiteModal').modal();

		initMap('edit_site_map', site.lat, site.lon);

		$('#saveAddSite').off().click( function(){

			var site = {
				id: site_uid,
				name: $('#add_site_name').val(), 
				description: $('#add_site_description').val(), 
				lat: $('#add_site_lat').val(),
				lon: $('#add_site_lon').val(),
				projects: []
			}

			$.ajax({
				type: 'POST',
				url: 'http://sciencetap.us/ionic/addEditSite.php',
				data: {
					data: site
				},
				dataType: 'json',
				success: function(response){    
					$('#addSiteModal').modal('hide');		
					sites_initialize();
				}
        
			});
		});	

	});
}

function initMap(id, lat, lng) {
	
	var pos = new google.maps.LatLng('39.988266', '-75.173738');

	map = new google.maps.Map(document.getElementById('create_site_map'), {
	    		center: pos,
	    		zoom: 8
	});
	if( lat == undefined || lng == undefined || lat == null || lng == null )
        {

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
      				var pos = {
        				lat: position.coords.latitude,
        				lng: position.coords.longitude
      				};
      				map.setCenter(pos);
    			}, function() {
				handleLocationError(true, infoWindow, map.getCenter());
    			});
		} else {
			handleLocationError(false, infoWindow, map.getCenter());
        	}
	} else {
		var pos = new google.maps.LatLng(lat, lng);		
		map.setCenter(pos); 
	}

	google.maps.event.addListener(map, 'click', function(event) {
        	placeMarker(event.latLng);
       		fillLatLon(event.latLng);
	});

}

function placeMarker(location) {
	
	for(i=0; i < markers.length; i++){
        	markers[i].setMap(null);
    	}

        marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    animation: google.maps.Animation.DROP
        });
	
	markers.push(marker);
}

function fillLatLon(pos){
	console.log(pos);
	$('#add_site_lat').val(pos.lat);
	$('#add_site_lon').val(pos.lng);

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

