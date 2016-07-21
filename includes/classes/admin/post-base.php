<?php
/**
 * GatherContent Importer
 *
 * @package GatherContent Importer
 */

namespace GatherContent\Importer\Admin;
use GatherContent\Importer\General;
use GatherContent\Importer\API;
use GatherContent\Importer\Admin\Mapping\Base as UI_Base;

/**
 * Because Enqueue is abstract.
 */
class Post_Enqueue extends Enqueue {}

/**
 * Class for managing syncing template items.
 */
abstract class Post_Base extends UI_Base {

	/**
	 * GatherContent\Importer\API instance
	 *
	 * @var GatherContent\Importer\API
	 */
	protected $api = null;

	/**
	 * GatherContent\Importer\Admin\Mapping_Wizzard instance
	 *
	 * @var GatherContent\Importer\Admin\Mapping_Wizzard
	 */
	protected $wizzard = null;

	/**
	 * GatherContent\Importer\Admin\Enqueue instance
	 *
	 * @var GatherContent\Importer\Admin\Enqueue
	 */
	protected $enqueue = null;

	/**
	 * A flag to check if this is an ajax request.
	 *
	 * @var boolean
	 */
	protected $doing_ajax = false;

	/**
	 * Creates an instance of this class.
	 *
	 * @since 3.0.0
	 *
	 * @param API             $api      API object.
	 * @param Mapping_Wizzard $wizzard Mapping_Wizzard object.
	 */
	public function __construct( API $api, Mapping_Wizzard $wizzard ) {
		$this->api        = $api;
		$this->wizzard    = $wizzard;
		$this->doing_ajax = defined( 'DOING_AJAX' ) && DOING_AJAX;
		$this->enqueue    = new Post_Enqueue;
	}

	/**
	 * Get the localizable data array.
	 *
	 * @since  3.0.0
	 *
	 * @return array Array of localizable data
	 */
	protected function get_localize_data() {
		return array(
			'_edit_nonce' => wp_create_nonce( General::get_instance()->admin->mapping_wizzard->option_group . '-options' ),
			'_statuses' => array(
				'starting' => __( 'Starting Sync', 'gathercontent-importer' ),
				'syncing'  => __( 'Syncing', 'gathercontent-importer' ),
				'complete' => __( 'Sync Complete', 'gathercontent-importer' ),
				'failed'   => __( 'Sync Failed', 'gathercontent-importer' ),
			),
			'_errors' => array(
				'unknown' => __( 'There was an unknown error', 'gathercontent-importer' ),
			),
			'_step_labels' => array(
				'accounts' => esc_html__( 'Select an account:', 'gathercontent-importer' ),
				'projects' => esc_html__( 'Select a project:', 'gathercontent-importer' ),
				'mappings' => sprintf( esc_html_x( 'Select a %s:', 'Select a template mapping', 'gathercontent-importer' ), General::get_instance()->admin->mapping_wizzard->mappings->args->labels->singular_name ),
			),
		);
	}
}
