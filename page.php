<?php
/**
 * The default template
 */

get_header(); ?>
	<div class="master-width vspace clearfix">
    	<div class="blog-header"></div>
		<?php get_template_part( 'content', 'page' ); ?>
	</div>
<?php get_footer(); ?>