<?php
/**
 * The template for displaying Category pages.
 * Used to display archive-type pages for posts in a category.
 *
 */

get_header(); ?>

<div class="master-width vspace clearfix">
	<div class="left-side"> 
		<?php if ( have_posts() ) : ?>		
			<div>
				<h1><?php printf( __( 'Category Archives: %s', 'twentytwelve' ), '<span>' . single_cat_title( '', false ) . '</span>' ); ?></h1>
			<?php if ( category_description() ) : ?>
				<div><?php echo category_description(); ?></div>
			<?php endif; ?>
			</div>
		
			<?php while ( have_posts() ) : the_post(); ?>
				<?php get_template_part( 'content', get_post_format() ); ?>
			<?php endwhile; ?>
			<?php whateverweb_list_nav('post-nav'); ?>

		<?php else : ?>
			<h3><?php echo 'Apologies, we have no recent posts.'; ?></h3>
		<?php endif; ?>
	</div>
	
	<div class="right-side">
		<?php get_sidebar(); ?>
	</div>
</div>

<?php get_footer(); ?>