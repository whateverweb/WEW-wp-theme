<?php
/**
 * The Template for displaying all single posts
 *
 */

get_header(); ?>

<div class="master-width vspace clearfix">
	<div class="left-side"> 
		
		<?php while ( have_posts() ) : the_post(); ?>
			<?php get_template_part( 'content', get_post_format() ); ?>
		<?php endwhile; ?>
		
		<?php comments_template( '', true ); ?>
	</div>
	
	<div class="right-side">
		<?php get_sidebar(); ?>
	</div>
</div>

<?php get_footer(); ?>