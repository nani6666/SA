
/*function scroll_to_class(element_class, removed_height) {
	var scroll_to = $(element_class).offset().top - removed_height;
	if($(window).scrollTop() != scroll_to) {
		$('html, body').stop().animate({scrollTop: scroll_to}, 0);
	}
}*/

function bar_progress(progress_line_object, direction) {
	var number_of_steps = progress_line_object.data('number-of-steps');
	var now_value = progress_line_object.data('now-value');
	var new_value = 0;
	if(direction == 'right') {
		new_value = now_value + ( 100 / number_of_steps );
	}
	else if(direction == 'left') {
		new_value = now_value - ( 100 / number_of_steps );
	}
	progress_line_object.attr('style', 'width: ' + new_value + '%;').data('now-value', new_value);
}

jQuery(document).ready(function() {
    /*
        Form
    */
    $('.f1 fieldset:first').fadeIn('slow');
    
    $('.f1 input[type="text"], .f1 input[type="password"], .f1 textarea').on('focus', function() {
    	$(this).removeClass('input-error');
    });
    
    // next step
    $('.f1 .btn-next').on('click', function() {
    	var parent_fieldset = $(this).parents('fieldset');
    	var next_step = true;
    	// navigation steps / progress steps
    	var current_active_step = $(this).parents('.f1').find('.f1-step.active');
    	var progress_line = $(this).parents('.f1').find('.f1-progress-line');
    	
    	// fields validation
    	/*parent_fieldset.find('input[type="text"], input[type="password"], textarea').each(function() {
    		if( $(this).val() == "" ) {
    			$(this).addClass('input-error');
    			next_step = false;
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});*/
    	// fields validation
    	
    	if( next_step ) {
    		parent_fieldset.fadeOut(400, function() {
    			// change icons
    			current_active_step.removeClass('active').addClass('activated').next().addClass('active');
    			// progress bar
    			bar_progress(progress_line, 'right');
    			// show next step
	    		$(this).next().fadeIn();
	    		// scroll window to beginning of the form
    			//scroll_to_class( $('.f1'), 20 );
	    	});
    	}
    	
    });
    
    // previous step
    $('.f1 .btn-previous').on('click', function() {
    	// navigation steps / progress steps
    	var current_active_step = $(this).parents('.f1').find('.f1-step.active');
    	var progress_line = $(this).parents('.f1').find('.f1-progress-line');
    	
    	$(this).parents('fieldset').fadeOut(400, function() {
    		// change icons
    		current_active_step.removeClass('active').prev().removeClass('activated').addClass('active');
    		// progress bar
    		bar_progress(progress_line, 'left');
    		// show previous step
    		$(this).prev().fadeIn();
    		// scroll window to beginning of the form
			//scroll_to_class( $('.f1'), 20 );
    	});
    });
    
    // submit
    $('.f1').on('submit', function(e) {
    	
    	// fields validation
    	$(this).find('input[type="text"], input[type="password"], textarea').each(function() {
    		if( $(this).val() == "" ) {
    			e.preventDefault();
    			$(this).addClass('input-error');
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});
    	// fields validation
    	
    });
    
    
});


/* zInput radio buttons Start */

$.fn.zInput = function(){

var $inputs = this.find(":radio,:checkbox");
$inputs.hide();
var inputNames = [];
$inputs.map(function(){
  inputNames.push($(this).attr('name'));
});

inputNames = $.unique(inputNames);

$.each(inputNames, function(index,value){

	var $element = $("input[name='" + value + "']");
	var elementType = $element.attr("type");
	$element.wrapAll('<div class="zInputWrapper" />');
	if (elementType == "radio"){
		$element.wrap(function(){ return '<div class="zInput"><span style="display:table;width: 100%;height: 100%;"><span style="display: table-cell;vertical-align:middle;">' + $(this).attr("title") + '</span></span></div>'});
	}
	if (elementType == "checkbox")
	{
		$element.wrap(function(){ return '<div class="zInput zCheckbox"><span style="display:table;width: 100%;height: 100%;"><span style="display: table-cell;vertical-align:middle;">' + $(this).attr("title") + '</span></span></div>'});	
	}
	
	});


var $zRadio = $(".zInput").not(".zCheckbox");
var $zCheckbox	= $(".zCheckbox");

$zRadio.click(function(){
	$theClickedButton = $(this);

	//move up the DOM to the .zRadioWrapper and then select children. Remove .zSelected from all .zRadio
	$theClickedButton.parent().children().removeClass("zSelected");
	$theClickedButton.addClass("zSelected");
	$theClickedButton.find(":radio").prop("checked", true).change();	
	});

$zCheckbox.click(function(){
	$theClickedButton = $(this);

	//move up the DOM to the .zRadioWrapper and then select children. Remove .zSelected from all .zRadio
	$theClickedButton.toggleClass("zSelected");
	$theClickedButton.find(':checkbox').each(function () { this.checked = !this.checked; $(this).change()});
	});	
	
  
  $.each($inputs,function(k,v){
    if($(v).attr('checked')){
      
      $(v).parent().click();
      
    }
    
  });
  
}

/* zInput radio buttons end */