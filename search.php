<?php
/**
 * The template for displaying Search Results
 */
get_template_part('docs-header'); ?>

<div class="left-side"> 
	<?php get_template_part('docs-sidebar'); ?>
</div>

<div class="right-side search-results">
    <?php if ( have_posts() && trim(get_search_query()) != '' && trim(get_search_query()) != null ) : ?>
    	
        <div class="right-side-columns clearfix">
        	<h2 class="search-page-title"><?php echo 'Results for: <span>' . get_search_query() . '</span>'; ?></h2>
        </div>
        
        <?php while ( have_posts() ) : the_post(); ?>
            <div class="right-side-columns clearfix">
				<h1><a href="<?php the_permalink(); ?>" title="Read more"><?php the_title(); ?></a></h1>
				<?php the_excerpt(); ?>
            </div>
        <?php endwhile; ?>
        <?php whateverweb_list_nav('post-nav'); ?>

    <?php else : ?>
    	<div class="right-side-columns clearfix">
        	<h2><?php echo 'Nothing found for: ' . get_search_query() . '; ?></h2>
        </div>
    <?php endif; ?>
</div>

<?php get_template_part('docs-footer'); ?>