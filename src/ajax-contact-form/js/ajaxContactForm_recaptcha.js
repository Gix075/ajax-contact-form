
/* ****************************************************** */
/*  GOOGLE RECAPTCHA VALIDATION */
/* ****************************************************** */

function reCaptchaValidator(params) {
    
    var defaults = {
            publicKey: null,
            theme: "light", //recaptcha theme
            debug: false, //
            phpValidator: 'ajax-contact-form/php/ajaxContactForm_recaptcha.php',
            callbacks: {
                success: null,
                error: null
            }
        },
        plugin = this;
    
    this.params = $.extend(true, defaults, params);
        
    this.getCaptcha = function (elementID) {
        grecaptcha.render(elementID, {
            'sitekey' : plugin.params.publicKey, 
            'theme' : plugin.params.theme
        });  
    },
        
    this.validateCaptcha = function(elementID) {
        var reCaptchaVal = {
            response: $('#'+elementID).find('.g-recaptcha-response').val()
        }
        console.log('value: '+reCaptchaVal.response);
        if(reCaptchaVal.response != "") {
            $.ajax({
                url: plugin.params.phpValidator,
                type: 'POST',
                data: reCaptchaVal,
                dataType: 'json',
                success: function(data) {
                    if(data.success === true) {
                        if (plugin.params.debug === true) console.log('reCaptchaValidator: Validation Success!'); // DEBUG Node
                        plugin.params.callbacks.success();
                    }else{
                        if (plugin.params.debug === true) console.log('reCaptchaValidator: Validation Fail!'); // DEBUG Node
                        plugin.params.callbacks.error();
                    }
                },
                error: function() {
                    if (plugin.params.debug === true) console.log('reCaptchaValidator: AjaxError!'); // DEBUG Node
                    plugin.params.callbacks.error();
                }
            });//end ajax
        }else{
            if (plugin.params.debug === true) console.log('reCaptchaValidator: No reCaptcha Data!'); // DEBUG Node
            plugin.params.callbacks.error();
        }
    }
}