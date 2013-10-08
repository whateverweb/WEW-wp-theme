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

	 <body>
    	<div class="page-wrapper">           
			<header>            	
                <div id="top-bar">
                    <div class="master-width clearfix">                        
                        <div id="admin-menu" style="display: block;">
	                        <a title="Go to Administration" id="admin-menu-trigger">Admin</a>                        
		                	<nav id="links-menu">
		                        <ul>
		                            <li class="first"><a href="http://whateverweb.com/myProjects.html">Dashboard</a></li> 
		                            <li><a href="http://whateverweb.com/statisticsQuotaAccount.html">My Account</a></li>   
		                            <li class="last"><a onClick="Whatever.Guardian.logout(); return false;">Logout</a></li>                
		                        </ul>
		                    </nav>
		                </div>
		                <div id="web-menu">
		                    <a title="Page Menu" id="web-menu-trigger">&equiv;</a>
	                        <nav id="main-menu">
	                            <ul>
	                            	<li class="first"><a href="http://whateverweb.com/about.html">About</a></li>                       	
	                            	<li><a href="http://whateverweb.com/pricing.html">Pricing</a></li>
	                                <li><a class="current" href="http://docs.whateverweb.com/">Blog</a></li>
                                    <li class="last"><a href="http://docs.whateverweb.com/introduction/">Documentation</a></li>
	                            </ul>
	                        </nav>
                        </div>
                         <h1 class="logo"><a title="WhateverWeb.com" href="http://whateverweb.com">WhateverWeb</a><span>Beta</span></h1>
                    </div>
                    <div class="clear"></div>
                </div>
                <div id="top-stripe-small">
                    <div class="master-width clouds-city"></div>
                </div>
            </header>
			
			<div id="page" class="clearfix">