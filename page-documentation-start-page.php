<?php
/*
Template Name: Page with the cloud heading
*/


get_header("doc-start"); ?>
<div id="page">
                <div class="master-width">                     	
                    <?php while ( have_posts() ) : the_post(); ?>
                        <div class="documentation-header">
                            <h1><?php the_title(); ?></h1>
                            <p>dette er en test</p>    
                        </div>
                        <?php the_content( __( 'Continue reading <span class="meta-nav">&rarr;</span>', 'twentytwelve' ) ); ?>
                    <?php endwhile; // end of the loop. ?>
            <div class="clear-footer"></div>
 </div>
<?php get_footer(); ?>