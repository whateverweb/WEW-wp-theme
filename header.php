<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="main">
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */
?><!DOCTYPE html>
<!--[if IE 7]>
<html class="ie ie7" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 8]>
<html class="ie ie8" <?php language_attributes(); ?>>
<![endif]-->
<!--[if !(IE 7) | !(IE 8)  ]><!-->
<html <?php language_attributes(); ?>>
<!--<![endif]-->
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<meta name="viewport" content="width=device-width" />
<title><?php wp_title( '|', true, 'right' ); ?></title>
<link rel="profile" href="http://gmpg.org/xfn/11" />
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
<!-- FavIcon -->
	<link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/images/favicon.png" />
	<!-- For iPhone 4 Retina display: -->
<link rel="apple-touch-icon-precomposed" sizes="114x114" href="<?php echo get_template_directory_uri(); ?>/images/favicon114x114.png" />
<!-- For iPad: -->
<link rel="apple-touch-icon-precomposed" sizes="72x72" href="<?php echo get_template_directory_uri(); ?>/images/favicon72x72.png" />
<!-- For non-Retina iPhone, iPod Touch, and Android 2.1+ devices: -->
<link rel="apple-touch-icon-precomposed" href="<?php echo get_template_directory_uri(); ?>/images/favicon57x57">

<!--[if IE]><link rel="shortcut icon" href="images/favicon.ico"><![endif]-->		
<meta name="msapplication-TileColor" content="#e34947">
<meta name="msapplication-TileImage" content="<?php echo get_template_directory_uri(); ?>/images/favicon64x64w.png">		

<!-- CSS -->
<link href='http://fonts.googleapis.com/css?family=PT+Sans:400,700,400italic,700italic|Sansita+One' rel='stylesheet' type='text/css'>
<link href="<?php echo get_template_directory_uri(); ?>/styles/main2.css" rel="stylesheet" type="text/css" />   
<link href="<?php echo get_template_directory_uri(); ?>/styles/wp-styles.css" rel="stylesheet" type="text/css" />   
<?php // Loads HTML5 JavaScript file to add support for HTML5 elements in older IE versions. ?>
<!--[if lt IE 9]>
<script src="<?php echo get_template_directory_uri(); ?>/js/html5.js" type="text/javascript"></script>
<![endif]-->
<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
  	<div class="page-wrapper">
            <header>
                <div id="top-bar">
                    <div class="master-width">                       
                        <div id="admin-menu">
	                        <a title="Go to Administration" id="admin-menu-trigger">Admin</a>                        
		                	<nav id="links-menu">
							<?php wp_nav_menu( array( 'menu' => 'AdminMenu',"container"=>0,"theme_location"=>"Secndary Menu") ); ?>
		                    </nav>
		                </div>
		                <div id="web-menu">
		                    <a title="Page Menu" id="web-menu-trigger">&equiv;</a>
	                        <nav id="main-menu">
							<?php wp_nav_menu( array( 'menu' => 'SiteMenu',"container"=>0,"theme_location"=>"Primary Menu") ); ?>

	                        </nav>
                        </div>
                         <h1 class="logo"><a title="WhateverWeb.com" href="http://whateverweb.com/">WhateverWeb</a></h1>
                    </div>
                    <div class="clear"></div>
                </div>
                <div id="top-stripe-small">
                    <div class="master-width clouds-city"></div>
                </div>
            </header>

