<legend class="screen-reader-text"><?php _e( 'Import Items', 'gathercontent-import' ); ?></legend>
<table class="widefat striped">
	<thead>
		<tr>
			<td id="cb" class="gc-field-th manage-column column-cb check-column"><label class="screen-reader-text" for="cb-select-all-1"><?php _e( 'Select All', 'gathercontent-import' ); ?></label>
				<input <# if ( data.checked ) { #>checked="checked"<# } #> id="cb-select-all-1" type="checkbox">
			</td>
			<th class="gc-field-th'"><?php _e( 'Item', 'gathercontent-import' ); ?></th>
			<th class="gc-field-th'"><?php _e( 'Status', 'gathercontent-import' ); ?></th>
			<th id="gc-edit" class="gc-field-th'"><?php _e( 'Edit', 'gathercontent-import' ); ?></th>
		</tr>
	</thead>
	<tbody>
		<tr><td colspan="3"><span class="gc-loader spinner is-active"></span></td></tr>
	</tbody>
	<tfoot>
		<tr>
			<td class="gc-field-th manage-column column-cb check-column"><label class="screen-reader-text" for="cb-select-all-1"><?php _e( 'Select All', 'gathercontent-import' ); ?></label>
				<input <# if ( data.checked ) { #>checked="checked"<# } #> id="cb-select-all-1" type="checkbox">
			</td>
			<th class="gc-field-th'"><?php _e( 'Item', 'gathercontent-import' ); ?></th>
			<th class="gc-field-th'"><?php _e( 'Status', 'gathercontent-import' ); ?></th>
			<th id="gc-edit" class="gc-field-th'"><?php _e( 'Edit', 'gathercontent-import' ); ?></th>
		</tr>
	</tfoot>
</table>
