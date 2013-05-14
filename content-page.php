<?php
/**
 * The template used for displaying default page content
 */
 
if (have_posts()): while (have_posts()): the_post(); ?>
	<h2><?php the_title(); ?></h2>
	<br /><?php the_content(); ?>
<?php endwhile; endif; ?>