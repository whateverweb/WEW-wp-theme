<?php
/**
 * The sidebar containing the main widget area.
 *
 * If no active widgets in sidebar, let's hide it completely.
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */
?>

	<?php if ( is_active_sidebar( 'sidebar-2' ) && is_page()) : ?>
			<?php dynamic_sidebar( 'sidebar-2' ); ?>
	<?php endif; ?>
		<?php if ( is_active_sidebar( 'sidebar-1' ) && !is_page() && !is_front_page()) : ?>
			<?php dynamic_sidebar( 'sidebar-1' ); ?>
	<?php endif; ?>
		<?php if ( is_active_sidebar( 'sidebar-3' ) && is_front_page()) : ?>
			<?php dynamic_sidebar( 'sidebar-3' ); ?>
	<?php endif; ?>
