<?php
/**
 * The default template for displaying content. Used for both single and index/archive/search.
 */
?>
<div class="post <?php if ( is_single() ) : ?> thumb<?php endif; ?>">
	<div class="post-title">		
		<?php if ( is_single() ) : ?>
			<!--<div class="post-author">
				<?php /*?><?php //the_post_thumbnail(); ?>
				<?php echo get_avatar( get_the_author_meta('user_email'), $size = '50', $default = '', $alt = 'author'); ?><?php */?>
			</div>-->
			<h1><?php the_title(); ?></h1>
		<?php else : ?>
			<h1><a href="<?php the_permalink(); ?>" title="Read <?php the_title(); ?>"><?php the_title(); ?></a></h1>
		<?php endif; // is_single() ?>
		<div class="post-date">By <?php the_author(); ?> &ndash; <?php the_time(get_option('date_format')); ?></div>
	</div>

	<?php if ( is_search() || is_front_page() ) : ?>
		<div><?php the_excerpt(); ?></div>
	<?php else : ?>
		<div><?php the_content(); ?></div>
	<?php endif; // is_search() ?>
	
	<?php if ( is_single() ) : wp_link_pages( array( 'before' => '', 'after' => '', 'next_or_number'   => 'next' ) ); endif; ?>

	<?php if ( comments_open() && !is_single() ) : ?>
		<div class="post-comments">
			<?php comments_popup_link( '<span class="leave-reply">' . __( 'Leave a reply', 'twentytwelve' ) . '</span>', __( '1 Reply', 'twentytwelve' ), __( '% Replies', 'twentytwelve' ) ); ?>
		</div>
	<?php endif; // comments_open() ?>
</div>
