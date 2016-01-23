//{BANNER}

/* 
    --------- NOTE -------------------------------------------------------
    This file is an example of javascript tool usage.
    Probably you need to customize it in order to use it on your server.
    Follow the istruction comments!
    ----------------------------------------------------------------------
*/


// AjaxContactForm Parameters
// ================================
var opts = {
    form: "#ajaxContactForm", // contact form id
    formBtn: "#ajaxContactFormBtn", // contact form submit button id
    ws: 'ajax-contact-form/php/ajaxContactForm.php', // php webservice path (relative to the form page)
    showMsg: true, // show success/fail message after message sending
    recaptcha: {
        pubKey: "6LeIdAUTAAAAAMVzPPCeASmJCbOBa2_3wI7J5azz", // Google ReCaptcha public key THIS IS MANDATORY - TOOL WILL NOT WORK WITHOUT THIS PARAMETER !!!!
        element: "ajaxContactForm_recaptcha", // Google ReCaptcha wrapper id
        theme: "dark", // Google ReCaptcha theme
        size: "compact",
        ws: 'ajax-contact-form/php/ajaxContactForm_recaptcha.php' // php webservice path (relative to the form page)
    }
};


$(window).on('load', function() {
    new ajaxContactForm(opts).init();
    
    /*var params = {
        publicKey: "6LeIdAUTAAAAAMVzPPCeASmJCbOBa2_3wI7J5azz",
        theme: "light", //recaptcha theme
        debug: true, //
        phpValidator: 'php/reCaptchaValidator.php',
        callbacks: {
            success: function() {alert('reCaptcha Success!')},
            error: function() {alert('reCaptcha Fail!')}
        }
    };
        
    var recaptcha = new reCaptchaValidator(params);
        
    recaptcha.getCaptcha('ajaxContactForm_recaptcha'); */   
        
});

