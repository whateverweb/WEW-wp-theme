<?php
/**
 * The template for displaying Search Results
 */
get_template_part('docs-header'); ?>

<div class="left-side"> 
	<?php get_template_part('docs-sidebar'); ?>
</div>

<div class="right-side search-results">
    <?php if ( have_posts() ) : ?>
    	<h1 class="page-title"><?php printf( __( 'Search Results for: %s', 'twentytwelve' ), '<span>' . get_search_query() . '</span>' ); ?></h1>
        
        <?php while ( have_posts() ) : the_post(); ?>
            <?php //the_title(); ?>
            <div class="right-side-columns clearfix">
				<?php the_excerpt(); ?>
            </div>
        <?php endwhile; ?>
        <?php whateverweb_list_nav('post-nav'); ?>

    <?php else : ?>
        <h3><?php echo 'Apologies, we have no recent news to post.'; ?></h3>
    <?php endif; ?>
</div>

<?php get_template_part('docs-footer'); ?>