<?php
/**
 * The docs sidebar
 */
?>

<?php if ( is_active_sidebar( 'sidebar-2' ) ) : ?>
	<div id="docs-sidebar" class="widget-area">
		<?php dynamic_sidebar( 'sidebar-2' ); ?>
	</div>
<?php endif; ?>