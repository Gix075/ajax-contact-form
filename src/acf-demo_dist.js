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
    form: "#ajaxContactForm", // Form ID
    formBtn: "#ajaxContactFormBtn", // Form submit button ID
    ws: 'ajax-contact-form/php/ajaxContactForm.php', // Webservice URL (relative to the form page)
    showMsg: true, // Enable/Disable error messages
    recaptcha: {
        pubKey: "YouRGooGLEreCapTcHAapIKeyPublicKey", // Google ReCaptcha public key
        element: "ajaxContactForm_recaptcha", // Google ReCaptcha element in your page
        theme: "light",
        ws: 'ajax-contact-form/php/ajaxContactForm_recaptcha.php'
    },
    attachments: {
        allowed: true,
        ws: 'ajax-contact-form/php/attachments/ajaxContactForm_attachments.php',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png|pdf|zip)$/i,
        maxFileSize: 20971520,
        maxTotalSize: 20971520,
        maxFiles: 10,
        cleanAfterMinutes: 20
    },
    messages: {
        attachments: {
            clean: 'TIMEOUT - Your file was removed, please upload it again!',
            fileRemoved: 'File removed!',
            errors: {
                uploadFailed: 'Upload failed!',
                maxNumberOfFiles: 'Sorry, maximum number of files exceeded',
                maxFileSize: 'Sorry, file too large!',
                maxTotalSize: 'Sorry the attachment size amount exceeds the maximum quota!',
                timeout: 'TIMEOUT - Your file was removed, please upload it again!',
                fileType: 'File type not allowed!'
            }
        }
    },
    debug: true
};



$(window).on('load', function() {
    new ajaxContactForm(opts).init();        
});