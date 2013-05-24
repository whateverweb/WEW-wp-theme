<?php
/**
 * The Header
 */
?>
<!DOCTYPE html>
<html dir="ltr" lang="en">
    <head> 
    	<!-- META -->
        <meta charset="UTF-8" />
        <meta name="author" content="Mobiletech AS" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <title><?php wp_title( '|', true, 'right' ); ?></title>
		<link rel="profile" href="http://gmpg.org/xfn/11" />
		<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
		
        <!-- FavIcon -->
		<link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/images/favicon.ico">	
		<meta name="msapplication-TileColor" content="#e34947">
		<meta name="msapplication-TileImage" content="<?php echo get_template_directory_uri(); ?>/images/favicon64x64w.png">
       	<link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/images/favicon.png" />
		<link rel="apple-touch-icon-precomposed" href="<?php echo get_template_directory_uri(); ?>/images/favicon57x57">		
		<link rel="apple-touch-icon-precomposed" sizes="72x72" href="<?php echo get_template_directory_uri(); ?>/images/favicon72x72.png" />
		<link rel="apple-touch-icon-precomposed" sizes="114x114" href="<?php echo get_template_directory_uri(); ?>/images/favicon114x114.png" />
		                
        <!-- CSS -->
        <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=PT+Sans:400,700,400italic,700italic|Sansita+One" />
		
		<?php wp_head(); ?>
	</head>

	 <body class="docs-section">
    	<div class="page-wrapper docs-page">           
			<header>            	
                <div id="top-bar">
                    <div class="clearfix">                       
                        <h1 class="logo"><a title="WhateverWeb.com" href="http://whateverweb.com/">WhateverWeb</a><span>Beta</span></h1>
                        <div class="widget_search"><?php get_search_form(); ?></div>
                    </div>
                </div>                
            </header>
			
			<div id="page" class="clearfix">