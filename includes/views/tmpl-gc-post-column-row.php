<span class="gc-status-column" data-id="{{ data.id }}" data-item="{{ data.item }}" data-mapping="{{ data.mapping }}">
<# if ( data.status.name ) { #>
	<div class="gc-item-status">
		<span class="gc-status-color <# if ( '#ffffff' === data.status.color ) { #> gc-status-color-white<# } #>" style="background-color:{{ data.status.color }};" data-id="{{ data.status.id }}"></span>
		{{ data.status.name }}
	</div>
<# } else { #>
	&mdash;
<# } #>
</span>
<?php
	// echo "<# console.log( 'data', data ); #>";
