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
    	
        <div class="right-side-columns clearfix">
        	<h1 class="page-title"><?php printf( __( 'Results for: %s', 'twentytwelve' ), '<span>' . get_search_query() . '</span>' ); ?></h1>
        </div>
        
        <?php while ( have_posts() ) : the_post(); ?>
            <?php //the_title(); ?>
            <div class="right-side-columns clearfix">
            	<?php $title = get_the_old_excerpt(); $keys= explode(" ",$s); $title = preg_replace('/('.implode('|', $keys) .')/iu', '<strong class="search-excerpt">\0</strong>', $title); ?>
				<?php echo $title; ?>
				<?php //the_excerpt(); ?>
            </div>
        <?php endwhile; ?>
        <?php whateverweb_list_nav('post-nav'); ?>

    <?php else : ?>
    	<div class="right-side-columns clearfix">
        	<h3><?php echo 'No search results found.'; ?></h3>
        </div>
    <?php endif; ?>
</div>

<?php get_template_part('docs-footer'); ?>