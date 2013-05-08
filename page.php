<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */

get_header(); ?>
<div id="page">
                <div class="master-width">                     	
                	<div class="column left-side">

			<?php while ( have_posts() ) : the_post(); ?>
				<?php get_template_part( 'content', 'page' ); ?>
			<?php endwhile; // end of the loop. ?>

</div>
                    <div class="column right-side">
                    	<div class="blog-archive">
<?php get_sidebar(); ?>
                    	</div>
                    </div>
                    <div class="clear-content"></div>
</div>
            <div class="clear-footer"></div>
        </div>
<?php get_footer(); ?>