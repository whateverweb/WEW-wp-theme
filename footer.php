<?php
/**
 * The template for displaying the footer.
 *
 * Contains footer content and the closing of the
 * #main and #page div elements.
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */
?>
</div>
<footer>
        	<div class="master-width">
        		<div id="footer-social">
                	<a class="footer-github" href="https://github.com/whateverweb" target="_blank">GitHub</a>
                    <a class="footer-twitter" href="https://twitter.com/WhatEverWeb" target="_blank">Twitter</a>
                </div>
                <h3>WhateverWeb <span>Let&rsquo;s bring web into the future</span></h3>
                <p class="footer-menu"><a href="http://whateverweb.com/about.html" class="first">About</a><a href="http://whateverweb.com/getting_started.html">Getting Started</a><a href="http://whateverweb.com/documentation.html">Documentation</a><a class="last" href="mailto:team@whateverweb.com">Support</a><a class="last" href="http://blog.whateverweb.com/">Blog</a></p>
                <p class="footer-menu"><a href="http://whateverweb.com/terms.html" class="first">Terms of Service</a><a href="http://whateverweb.com/privacy.html" class="last">Privacy Policy</a>
                <p>Copyright © 2013-<?php echo date("Y");?> WhateverWeb.com<br />Brought to you by Mobiletech</p>                
            </div>
        </footer>
        
        <!-- JS -->
        <script src="http://whateverweb.comscripts/whatever.config.js"></script>
        <script src="http://whateverweb.comscripts/whatever.utils.js"></script>
        <script src="http://whateverweb.comwidgets/js/ajax.js"></script>
        <script src="http://whateverweb.comscripts/guardian.js"></script>

		<script type="text/javascript">
		  var _gaq = _gaq || [];
		  _gaq.push(['_setAccount', 'UA-36395921-1']);
		  _gaq.push(['_trackPageview']);
		
		  (function() {
		    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		  })();		
		</script>
<?php wp_footer(); ?>
			
    </body>    
</html>