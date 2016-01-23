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
    ws: 'ajax-contact-form/php/ajaxContactForm.json', // php webservice path (relative to the form page)
    showMsg: true, // show success/fail message after message sending
    recaptcha: {
        pubKey: "YouRGooGLEreCapTcHAapIKeyPublicKey", // Google ReCaptcha public key THIS IS MANDATORY - TOOL WILL NOT WORK WITHOUT THIS PARAMETER !!!!
        element: "#ajaxContactForm_recaptcha", // Google ReCaptcha wrapper id
        theme: "light", // Google ReCaptcha theme
        ws: 'ajax-contact-form/php/ajaxContactForm_recaptcha.php' // php webservice path (relative to the form page)
    }
};


$(document).on('ready', function() {
    new ajaxContactForm(opts).init();
});

