<?php
/**
 * The Footer
 */
?>
		<div class="clear-footer"></div>
		</div><!-- #page -->
		</div><!-- .page-wrapper -->
		<footer>
        	<div class="master-width">
        		<div id="footer-social">
                	<a class="footer-github" href="https://github.com/whateverweb" target="_blank">GitHub</a>
                    <a class="footer-twitter" href="https://twitter.com/WhatEverWeb" target="_blank">Twitter</a>
					<a class="footer-blog" href="http://blog.ftudoran.com/">Blog</a>
                </div>
                <h3>WhateverWeb <span>Let&rsquo;s bring web into the future</span></h3> 
				<?php $menuParameters = array('menu' => 'Footer Main Menu', 'container' => false, 'echo' => false, 'items_wrap' => '%3$s', 'depth' => 0); ?>
				<p class="footer-menu"><?php echo strip_tags(wp_nav_menu( $menuParameters ), '<a>' ); ?></p>
				
				<?php $menuParameters = array('menu' => 'Footer Links', 'container' => false, 'echo' => false, 'items_wrap' => '%3$s', 'depth' => 0); ?>
				<p class="footer-menu"><?php echo strip_tags(wp_nav_menu( $menuParameters ), '<a>' ); ?></p>							
                <p>Copyright &copy; 2013-2014 WhateverWeb.com<br />Brought to you by Mobiletech</p>                
            </div>
        </footer>
        
        <!-- JS 
		<script src="scripts/whatever.config.js"></script>
		<script src="scripts/whatever.utils.js"></script>
		<script src="widgets/js/ajax.js"></script>
		<script src="widgets/js/modalview.js"></script>
		<script src="scripts/guardian.js"></script>
		<script src="widgets/js/animator.js"></script>
		<script src="scripts/animateMenu.js"></script>
		
		
		
		<script>
		  var _gaq = _gaq || [];
		  _gaq.push(['_setAccount', 'UA-36395921-1']);
		  _gaq.push(['_trackPageview']);
		
		  (function() {
		    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		  })();		
		</script>

		-->
		
		<?php wp_footer(); ?>
    </body>    
</html>