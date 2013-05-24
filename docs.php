<?php
/**
 * Template Name: Docs Template
 *
 */
get_template_part('docs-header'); ?>

<div class="left-side"> 
	<?php get_template_part('docs-sidebar'); ?>
</div>

<div class="right-side">
	<div class="right-side-columns clearfix">
		<?php if ( have_posts() ) : ?>
            <?php while ( have_posts() ) : the_post(); ?>
                <?php the_content(); ?>
            <?php endwhile; ?>
            <?php whateverweb_list_nav('post-nav'); ?>
    
        <?php else : ?>
            <h3><?php echo 'Apologies, we have no recent content.'; ?></h3>
        <?php endif; ?>
    </div>
</div>


<?php get_template_part('docs-footer'); ?>