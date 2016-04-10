window.onload = function() {

	$('#modal_content').load('templates/modals.html');

	$('#data_page').click( function(){

		data_initialize();
	});

	$('#users_page').click( function(){
        	users_initialize();           
	});

	$('#projects_page').click( function(){
		projects_initialize();
        });

	$('#sites_page').click( function(){
       		sites_initialize();           
        });


	$('#forms_page').click( function(){
		forms_initialize();
        });
}
