
function data_initialize() {

	var projects = [];
	$('.page_content_wrapper').html('');
	$('.page_content_wrapper').load('templates/data.html');	
	$.ajax({
		type: 'GET',
		url: 'http://sciencetap.us/ionic/getUserProjects.php',
		data: {
			user_uid: null,
			admin: true
		},
		dataType: 'json',
		success: function(response){
			
			var projects = response.data;
			var projects_indexed = [];
			for( var i = 0; i< projects.length; i++ )
			{
				projects_indexed[projects[i].id] = projects[i];
				$("#project_select").append("<option value='"+ projects[i].id+"'>" + projects[i].name + "</option>");
			}
			
			$("#project_select").change( function(e){
       	 			var id = $(e.target).val();
				console.log(projects_indexed[id]);
				fillOptions( projects_indexed[id] );
				
			});

			$('#getData').off().click( function(){
				
				var project = $("#project_select").val();
				var site = $("#site_select").val();
				var form = $("#form_select").val();

				$.ajax({
                			type: 'POST',
					url: 'http://sciencetap.us/ionic/getReportData.php',
					data: {
						projects: project,
						sites: site,
						forms: form
					},
					dataType: 'json',
					success: function( response )
					{	
						$('.page_content_wrapper').html('<div id="table_container"></div>');
						view_data_initialize(response.data);
					}
				});
			});
					
		}
	});
}

function fillOptions( project ) {

	$('#site_select').html('<option value="all">All</option>');
	$('#form_select').html('<option value="all">All</option>');
		
	for( var i = 0; i < project.sites.length; i++ )
	{
		$('#site_select').append("<option value='"+ project.sites[i].id+"'>" + project.sites[i].name + "</option>");
	}

	for( var j = 0; j < project.forms.length; j++ )
	{
		$('#form_select').append("<option value='"+ project.forms[j].id+"'>" + project.forms[j].name + "</option>");
	}
	

}

