
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
