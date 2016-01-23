/*! 
 * ************************************************************************* 
 *  AjaxContactForm | Simple ajax contact form 
 *  Version 1.5.0 - Date: 23/01/2016 
 *  HomePage: https://github.com/Gix075/ajax-contact-form 
 * ************************************************************************* 
*/ 

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
};
/* ****************************************************** */
/*  FORM VALIDATION
    Based on Form Validator 0.9.1 alpha */
/* ****************************************************** */

function formValidator(globOpts) {
    
    var opts = "";
    var validator = "";
    
    this.opts = globOpts,
    this.formValidation = true,
    this.validInput = false,
    this.validTextarea = false,
    this.validPassword = false,
    this.validEmail = false,
    this.validSelect = false,
    this.validRadio = false,
    this.validCheckbox = false,
    this.validPhone = false,
    opts = this.opts,
    validator = this,
 
    // validation method
    this.validate = function(element,button,callbacks) {
        $(button).on('click', function(e){
            
            e.preventDefault();
            
            var form = $('form'+element);
            var input = form.find('input.validate').not('input[type="radio"]').not('input[type="checkbox"]');
            var password = form.find('input[type="password"].validate.pswd-confirm');
            var phone = form.find('input[type="tel"].validate');
            var textarea = form.find('textarea.validate');
            var select = form.find('select.validate');
            var email = form.find('input[type="email"].validate');
            var radio = form.find('.radio-group.validate');
            var checkbox = form.find('.checkbox-group.validate');
            var loopError = 0;
           
            // text, tel and all commons inputs
            $(input).each(function(){
                if($(this).val() == "") {
                    if(opts.showErrors === true) validator.showError(this,'input','empty');
                    loopError = loopError + 1;
                }else{
                    if(opts.showErrors === true) validator.hideError(this,'input');
                }
            }); 
            validator.validInput = (loopError > 0) ?  false : true;
            loopError = 0;
            // end input
            
            // Telephone input
            $(phone).each(function(){
                var telValue = $(this).val();
                if(telValue != "") {
                    var reg = /^\d+$/;
                    if ( reg.test(telValue) === false) {
                        if(opts.showErrors === true) validator.showError(this,'input','wrong');
                        loopError = loopError + 1;
                    }else{
                        if(opts.showErrors === true) validator.hideError(this,'input');
                    }
                }
            }); 
            validator.validPhone = (loopError > 0) ?  false : true;
            loopError = 0;
            
            // textarea
            $(textarea).each(function(){
                 if($(this).val() == "") {
                    if(opts.showErrors === true) validator.showError(this,'textarea','empty');
                    loopError = loopError + 1;
                }else{
                    if(opts.showErrors === true) validator.hideError(this,'textarea');
                }
            }); 
            validator.validTextarea = (loopError > 0) ?  false : true;
            loopError = 0;
            
            // end textarea
            
            // select
            $(select).each(function(){
                if (!$("option:selected", this).not('.not-option').length) {
                    if(opts.showErrors === true) validator.showError(this,'select','empty');
                    loopError = loopError + 1;
                }else{
                    if(opts.showErrors === true) validator.hideError(this,'select');
                }
            });
            validator.validSelect = (loopError > 0) ?  false : true;
            loopError = 0;
            //end select
            
            
            $(email).not('.email-confirm').each(function(){
                if( $(this).val() != "" && opts.mailformat === true ) {
                    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if ( re.test($(this).val()) === false ) {
                        if(opts.showErrors === true) validator.showError(this,'email','wrong');
                        loopError = loopError + 1;
                    }else{
                        if(opts.showErrors === true) validator.hideError(this,'email');
                    }
                }
                
                if( $(this).val() != "" && opts.mailconfirm === true && loopError == 0 ) {
                    console.log($(this).attr('id'));
                    var confirmElement = $('.email-confirm[data-confirm="#'+ $(this).attr('id') +'"]');
                    if ( $(this).val() != $(confirmElement).val() ) {
                        if(opts.showErrors === true) validator.showError(confirmElement,'email','wrong');
                        loopError = loopError + 1;
                    }else{
                        if(opts.showErrors === true) validator.hideError(confirmElement,'email');
                    }
                }
                
            });
            validator.validEmail = (loopError > 0) ?  false : true;
            loopError = 0;
            //end email
            
            //password 
            if(opts.passwordconfirm === true) {
                $(password).each(function(){
                    if($(this).val() != "") {
                        var confirmPswdElement = $(this).data('confirm');
                        if ( $(this).val() != $(confirmPswdElement).val() ) {
                            if(opts.showErrors === true) validator.showError(this,'password','wrong');
                            loopError = loopError + 1;
                        }else{
                            if(opts.showErrors === true) validator.hideError(this,'password');
                        }
                    }
                });
            }
            validator.validPassword = (loopError > 0) ?  false : true;
            loopError = 0;
            
            // radio
            $(radio).each(function(){
                var checkedbox = false;
                $(this).find('input[type="radio"]').each(function(){
                    if($(this).is(':checked')) checkedbox = true;
                })
                
                if( checkedbox === false ) {
                    if(opts.showErrors === true) validator.showError(this,'radio','empty');
                    loopError = loopError + 1;
                }else{
                    if(opts.showErrors === true) validator.hideError(this,'radio');
                }
   
            }); 
            validator.validRadio = (loopError > 0) ?  false : true;
            loopError = 0;
            // end radio
            
            // checkbox
            $(checkbox).each(function(){
                var checkedbox = false;
                $(this).find('input[type="checkbox"]').each(function(){
                    if($(this).is(':checked')) checkedbox = true;
                })
                
                if( checkedbox === false ) {
                    if(opts.showErrors === true) validator.showError(this,'checkbox','empty');
                    loopError = loopError + 1;
                }else{
                    if(opts.showErrors === true) validator.hideError(this,'checkbox');
                }
   
            }); 
            validator.validCheckbox = (loopError > 0) ?  false : true;
            loopError = 0;
            // end checkbox
            
            // Callback Functions
            if (validator.validInput === true && validator.validPassword === true && validator.validPhone === true && validator.validTextarea === true && validator.validEmail === true && validator.validSelect === true && validator.validRadio === true && validator.validCheckbox === true ) {
                callbacks.success();
            }else{
                callbacks.fail();
            }
 
            
        }); //end click
        
        
    }, // end validate()
    
    this.showError = function(inputElement,inputType,errorType) {
        if (inputType == 'radio' || inputType == 'checkbox') {
            // checkbox and radio error message
            ( opts.bootstrap === true ) ? $(inputElement).closest('.'+inputType+'-group').addClass('has-error') : $(inputElement).addClass('error');
            $(inputElement).closest('.'+inputType+'-group').find('.form-input-error-msg').addClass('show-error');
        }else{
            // common inputs error message
            ( opts.bootstrap === true ) ? $(inputElement).closest('.form-group').addClass('has-error') : $(inputElement).addClass('error');
            $(inputElement).prev('.form-input-error-msg').addClass('show-error');
            switch(errorType) {
                case 'empty':
                    $(inputElement).prev('.form-input-error-msg').find('.error-wrong').removeClass('show-error');
                    $(inputElement).prev('.form-input-error-msg').find('.error-empty').addClass('show-error');
                    break;
                case 'wrong':
                    $(inputElement).prev('.form-input-error-msg').find('.error-empty').removeClass('show-error');
                    $(inputElement).prev('.form-input-error-msg').find('.error-wrong').addClass('show-error');
                    break;
            }//end switch
            
        }
        
    },
    this.hideError = function(inputElement,inputType) {
        if (inputType == 'radio' || inputType == 'checkbox') {
            ( opts.bootstrap === true ) ? $(inputElement).closest('.'+inputType+'-group').removeClass('has-error') : $(inputElement).removeClass('error');
            $(inputElement).closest('.'+inputType+'-group').find('.form-input-error-msg').removeClass('show-error');
        }else{
            ( opts.bootstrap === true ) ? $(inputElement).closest('.form-group').removeClass('has-error') : $(inputElement).removeClass('error');
            $(inputElement).prev('.form-input-error-msg').removeClass('show-error');
            $(inputElement).prev('.form-input-error-msg').find('.error-empty,.error-wrong').removeClass('show-error');
        }
        
    },
    this.clearError = function(formElement) {
        $(formElement).find('*').removeClass('error');
        $(formElement).find('*').removeClass('has-error');
        $(formElement).find('*').removeClass('show-error');
    }
 
};
function ajaxContactForm(opts) {
    
    var defaultOptions = {
            form: "#ajaxContactForm",
            formBtn: "#ajaxContactFormBtn",
            ws: 'ajax-contact-form/php/ajaxContactForm.php',
            showMsg: true,
            recaptcha: {
                pubKey: "",
                element: "ajaxContactForm_recaptcha",
                theme: "light",
                ws: 'ajax-contact-form/php/ajaxContactForm_recaptcha.php'
            }
        },
        plugin= this;
    
    // Settings
    this.settings = $.extend(true, defaultOptions, opts );
    
    // Recaptcha 
    var recaptchaParams = {
        publicKey: this.settings.recaptcha.pubKey,
        theme: this.settings.recaptcha.theme, //recaptcha theme
        debug: true, //
        phpValidator: this.settings.recaptcha.ws,
        callbacks: {
            success: function() {
                $('#' + plugin.settings.recaptcha.element).prev('.form-input-error-msg').hide();
                plugin.sendMessage();
            },
            error: function() {
                $('#' + plugin.settings.recaptcha.element).prev('.form-input-error-msg').show();
            }
        }
    };  
    
    this.recaptcha = new reCaptchaValidator(recaptchaParams);
    
    // Init
    this.init = function() {
        this.recaptcha.getCaptcha(this.settings.recaptcha.element);
        this.validateContactForm();
    };
    
    this.validateContactForm = function() {
        
        var validatorOptions = {
                bootstrap: true,
                mailconfirm: true,
                mailformat: true,
                showErrors: true
            };
        
        new formValidator(validatorOptions).validate(this.settings.form, this.settings.formBtn,
        {
            success:function(){
                console.log('%c AjaxContactForm: validation success! ','background:#333;color:#fff;');
                $(plugin.settings.form).find('.acf_messagebox').height($(plugin.settings.form).height());
                plugin.spinnerPlay();
                
                // Recaptcha Validation
                plugin.recaptcha.validateCaptcha(plugin.settings.recaptcha.element);
                
            },
            fail:function(){
                console.log('%c AjaxContactForm: validation fail! ','background:#333;color:red;');
            }
        });
    };
    
    this.sendMessage = function() {
        var formData = $(this.settings.form).serialize();
        var plugin = this;
        $.ajax({
            url: this.settings.ws,
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(data) {
                plugin.spinnerStop();
                if (plugin.settings.showMsg === true) {
                    $(plugin.settings.form).find('.acf_messagebox').show();
                    $(plugin.settings.form).find('.acf_messagebox > .msg-error').hide();
                    $(plugin.settings.form).find('.acf_messagebox > .msg-success').show();
                    $('.acf_close-msg').on('click', function(e) {
                        e.preventDefault();
                        $(this).closest('.acf_messagebox').hide();
                    });
                }
            },
            error: function() {
                console.log('%c AjaxContactForm: AJAX_ERROR ','background:red;color:#fff;');
                plugin.spinnerStop();
                $(plugin.settings.form).find('.acf_messagebox').show();
                $(plugin.settings.form).find('.acf_messagebox > .msg-success').hide();
                $(plugin.settings.form).find('.acf_messagebox > .msg-error').show();
                $('.acf_close-msg').on('click', function(e) {
                    e.preventDefault();
                    $(this).closest('.acf_messagebox').hide();
                });
            }
        });
    };
    
    this.spinnerPlay = function() {
        $(this.settings.form).find('.acf_spinner-wrapper').show();
    }
    
    this.spinnerStop = function() {
        $(this.settings.form).find('.acf_spinner-wrapper').hide();
    }
}
