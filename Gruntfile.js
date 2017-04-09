module.exports = function(grunt) {

  // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*! \n' +
                    ' * ************************************************************************* \n' +
                    ' *  <%= pkg.title %> | <%= pkg.description %> \n'+
                    ' *  Version <%= pkg.version %> - Date: <%= grunt.template.today("dd/mm/yyyy") %> \n' +
                    ' *  HomePage: <%= pkg.home %> \n'+
                    ' * ************************************************************************* \n' +
                    '*/ \n',
            bannerHtml: '<!-- <%= pkg.title %> (v.<%= pkg.version %>) | <%= pkg.description %> -->'
        },
        clean: {
            dist: {
                src: ["dist"]
            }
        },
        
        'string-replace': {
            dist: {
                files: {
                    '<%= pkg.dev.distDir %>/php/ajaxContactForm.php':'<%= pkg.dev.devDir %>/php/ajaxContactForm.php',
                    '<%= pkg.dev.distDir %>/php/ajaxContactForm_recaptcha.php':'<%= pkg.dev.devDir %>/php/ajaxContactForm_recaptcha.php',
                    '<%= pkg.dev.distDir %>/php/config.php':'<%= pkg.dev.devDir %>/php/config_dist.php',
                    '<%= pkg.dev.distDir %>/php/backups/ajaxContactForm_backup.php':'<%= pkg.dev.devDir %>/php/backups/ajaxContactForm_backup.php',
                    '<%= pkg.dev.distDir %>/php/backups/ajaxContactForm_backup.php':'<%= pkg.dev.devDir %>/php/backups/ajaxContactForm_backuplist.php',
                    '<%= pkg.dev.distDir %>/php/acf-backups.php':'<%= pkg.dev.devDir %>/php/acf-backups.php',
                    '<%= pkg.dev.distDir %>/php/attachments/ajaxContactForm_attachments.php':'<%= pkg.dev.devDir %>/php/attachments/ajaxContactForm_attachments.php',
                    '<%= pkg.dev.distDir %>/php/attachments/ajaxContactForm_cleaner.php':'<%= pkg.dev.devDir %>/php/attachments/ajaxContactForm_cleaner.php',
                    'dist/acf-demo.html':'src/acf-demo.html',
                    'dist/acf-demo.js':'src/acf-demo_dist.js',
                    'dist/acf-demo.css':'src/acf-demo.css'
                },
                options: {
                    replacements: [
                        {
                            pattern: '//{BANNER}',
                            replacement: '<%= meta.banner %>'
                        },
                        {
                            pattern: '/*{BANNER}*/',
                            replacement: '<%= meta.banner %>'
                        },
                        {
                            pattern: '<!-- {BANNER} -->',
                            replacement: '<%= meta.bannerHtml %>'
                        }
                    ]
                }
            }
        },
        
        concat: {
            options: {
                separator: ';',
                banner: '<%= meta.banner %>'
            },
            base: {
                src: [
                    '<%= pkg.dev.devDir %>/js/ajaxContactForm_recaptcha.js',
                    '<%= pkg.dev.devDir %>/js/ajaxContactForm_validator.js',
                    '<%= pkg.dev.devDir %>/js/ajaxContactForm.js'
                ],
                dest: '<%= pkg.dev.distDir %>/js/ajaxContactForm.js'
            },
            pack: {
                src: [
                    '<%= pkg.dev.devDir %>/js/jquery.ui.widget.js',
                    '<%= pkg.dev.devDir %>/js/jquery.fileupload.js',
                    '<%= pkg.dev.devDir %>/js/jquery.fileupload-process.js',
                    '<%= pkg.dev.devDir %>/js/jquery.fileupload-validate.js',
                    '<%= pkg.dev.devDir %>/js/ajaxContactForm_recaptcha.js',
                    '<%= pkg.dev.devDir %>/js/ajaxContactForm_validator.js',
                    '<%= pkg.dev.devDir %>/js/ajaxContactForm.js'
                ],
                dest: '<%= pkg.dev.distDir %>/js/ajaxContactForm.pack.js'
            }
        },
        
        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
              files: {
                  '<%= pkg.dev.distDir %>/js/ajaxContactForm.min.js': ['<%= pkg.dev.distDir %>/js/ajaxContactForm.js'],
                  '<%= pkg.dev.distDir %>/js/ajaxContactForm.pack.min.js': ['<%= pkg.dev.distDir %>/js/ajaxContactForm.pack.js']
              }
            }
        },
        
        copy: {
            dist: {
                files: [
                    {src: '<%= pkg.dev.devDir %>/css/ajaxContactForm.less', dest: '<%= pkg.dev.distDir %>/css/ajaxContactForm.less'},
                    {
                        src: '<%= pkg.dev.devDir %>/php/attachments/attachments_logs.txt', 
                        dest: '<%= pkg.dev.distDir %>/php/attachments/attachments_logs.txt'
                    },
                    {
                        src: '<%= pkg.dev.devDir %>/php/attachments/UploadHandler.php', 
                        dest: '<%= pkg.dev.distDir %>/php/attachments/UploadHandler.php'
                    },
                    {
                        src: '<%= pkg.dev.devDir %>/php/attachments/files/.htaccess', 
                        dest: '<%= pkg.dev.distDir %>/php/attachments/files/.htaccess'
                    },
                    {
                        src: '<%= pkg.dev.devDir %>/php/backups/files/htaccess_dist.txt', 
                        dest: '<%= pkg.dev.distDir %>/php/backups/files/htaccess.txt'
                    },
                    {
                        expand: true, 
                        cwd: '<%= pkg.dev.devDir %>/php/phpmailer/', 
                        src: ['*.php'],
                        dest: '<%= pkg.dev.distDir %>/php/phpmailer/'
                    },
                    {
                        expand: true, 
                        cwd: '<%= pkg.dev.devDir %>/js/', 
                        src: ['jquery.*'],
                        dest: '<%= pkg.dev.distDir %>/js/jquery-upload/'
                    },
                    {
                        expand: true, 
                        cwd: '<%= pkg.dev.devDir %>/markup/', 
                        src: ['*.html'],
                        dest: '<%= pkg.dev.distDir %>/markup/'
                    }
                ]
            }
        },
        
        less: {
            dist: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                files: [{
                    "<%= pkg.dev.distDir %>/css/ajaxContactForm.css": "<%= pkg.dev.distDir %>/css/ajaxContactForm.less"
                }]
            }
        },
        
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1,
                banner: '<%= meta.banner %>'
            },
            dist: {
                files: {
                    '<%= pkg.dev.distDir %>/css/ajaxContactForm.min.css': ['<%= pkg.dev.distDir %>/css/ajaxContactForm.css']
                }
            }
        },
        processhtml: {
            dist: {
              files: {
                  'dist/acf-demo.html': ['dist/acf-demo.html']
              }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-processhtml');

    // Default task(s).
    grunt.registerTask('default', [
        'clean:dist',
        'string-replace:dist',
        'concat',
        'uglify:dist',
        'copy:dist',
        'less:dist',
        'cssmin:dist',
        'processhtml:dist'
    ]);

};