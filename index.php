<?php
/**
 * The Main template
 *
 */
get_header(); ?>

<div class="master-width vspace clearfix">
	<div class="left-side"> 
		<?php if ( have_posts() ) : ?>
			<?php while ( have_posts() ) : the_post(); ?>
				<?php get_template_part( 'content', get_post_format() ); ?>
			<?php endwhile; ?>
			<?php whateverweb_list_nav('post-nav'); ?>

		<?php else : ?>
			<p><strong><?php echo 'Apologies, we have no recent news to post.'; ?></strong></p>
		<?php endif; ?>
	</div>
	
	<div class="right-side">
		<?php get_sidebar(); ?>
	</div>
</div>

<?php get_footer(); ?>