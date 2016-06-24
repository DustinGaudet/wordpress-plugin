<?php
namespace GatherContent\Importer;

class General extends Base {

	protected static $single_instance = null;

	/**
	 * GatherContent\Importer\API instance
	 *
	 * @var GatherContent\Importer\API
	 */
	public $api;

	/**
	 * GatherContent\Importer\Admin instance
	 *
	 * @var GatherContent\Importer\Admin
	 */
	public $admin;

	/**
	 * GatherContent\Importer\importer Sync\Pull instance
	 *
	 * @var GatherContent\Importer\importer Sync\Pull
	 */
	public $importer;

	/**
	 * GatherContent\Importer\Select2_Ajax_Handler instance
	 *
	 * @var GatherContent\Importer\Select2_Ajax_Handler
	 */
	public $ajax_handler;

	/**
	 * Creates or returns an instance of this class.
	 * @since  3.0.0
	 * @return General A single instance of this class.
	 */
	public static function get_instance() {
		if ( null === self::$single_instance ) {
			self::$single_instance = new self();
		}

		return self::$single_instance;
	}

	protected function __construct() {
		parent::__construct( $_GET, $_POST );

		$this->api      = new API( _wp_http_get_object() );
		$this->admin    = new Admin\Admin( $this->api );
		if ( isset( $this->admin->mapping_wizzard->mappings ) ) {
			$this->pull = new Sync\Pull(
				$this->api,
				$this->admin->mapping_wizzard->mappings
			);
			$this->push = new Sync\Push(
				$this->api,
				$this->admin->mapping_wizzard->mappings
			);
			$this->ajax_handler = new Admin\Ajax\Handlers(
				$this->admin->mapping_wizzard->mappings
			);
		}
	}

	public function init_hooks() {
		$this->admin->init_hooks();
		if ( $this->pull ) {
			$this->pull->init_hooks();
			$this->push->init_hooks();
			$this->ajax_handler->init_hooks();
		}
	}

}

