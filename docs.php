<?php
/**
 * Template Name: Docs Template
 *
 */
get_template_part('docs-header'); ?>

<div class="left-side" id="left-side-menu"> 
	<?php get_template_part('docs-sidebar'); ?>
</div>

<div class="right-side">
	<div class="right-side-columns clearfix">
		<?php if ( have_posts() ) : ?>
            <?php while ( have_posts() ) : the_post(); ?>
                <h1><?php the_title(); ?></h1>
				<?php the_content(); ?>
            <?php endwhile; ?>
            <?php whateverweb_list_nav('post-nav'); ?>
    
        <?php else : ?>
            <h2><?php echo 'We have no recent content.'; ?></h2>
        <?php endif; ?>
    </div>
</div>


<?php get_template_part('docs-footer'); ?>