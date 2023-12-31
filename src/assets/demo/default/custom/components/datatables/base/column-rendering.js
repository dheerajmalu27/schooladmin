//== Class definition

var DatatableColumnRenderingDemo = function () {
	//== Private functions

	// basic demo
	var demo = function () {

		var datatable = $('.m_datatable').mDatatable({
			// datasource definition
			data: {
				type: 'remote',
				source: {
					read: {
						url: 'inc/api/datatables/demos/default.php'
					}
				},
				pageSize: 10, // display 20 records per page
				saveState: {
					cookie: true,
					webstorage: true
				}, // save datatable state(pagination, filtering, sorting, etc) in cookie or browser webstorage
				serverPaging: true,
				serverFiltering: true,
				serverSorting: true
			},

			// layout definition
			layout: {
				theme: 'default', // datatable theme
				class: '', // custom wrapper class
				scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
				height: 550, // datatable's body's fixed height
				footer: false // display/hide footer
			},

			// column sorting
			sortable: true,

			pagination: true,

			// columns definition
			columns: [{
				field: "RecordID",
				title: "#",
				sortable: false, // disable sort for this column
				width: 40,
				textAlign: 'center',
				selector: {class: 'm-checkbox--solid m-checkbox--brand'}
			}, {
				width: 200,
				field: "CompanyAgent",
				title: "Agent",
				template: function (row:any) {
					var number =mUtil.getRandomInt(1, 14);
					var user_img = '100_' + number + '.jpg';

					if (number > 8) {
						output = '<div class="m-card-user m-card-user--sm">\
								<div class="m-card-user__pic">\
									<img src="./assets/app/media/img/users/' + user_img + '" class="m--img-rounded m--marginless" alt="photo">\
								</div>\
								<div class="m-card-user__details">\
									<span class="m-card-user__name">' + row.CompanyAgent + '</span>\
									<a href="" class="m-card-user__email m-link">' + row.CompanyName + '</a>\
								</div>\
							</div>';
					} else {
						var stateNo = mUtil.getRandomInt(0, 7);
						var states = ['success', 'brand', 'danger', 'accent', 'warning', 'metal', 'primary', 'info'];
						var state = states[stateNo];

						output = '<div class="m-card-user m-card-user--sm">\
								<div class="m-card-user__pic">\
									<div class="m-card-user__no-photo m--bg-fill-' + state + '"><span>' + row.CompanyAgent.substring(0, 1) + '</span></div>\
								</div>\
								<div class="m-card-user__details">\
									<span class="m-card-user__name">' + row.CompanyAgent + '</span>\
									<a href="" class="m-card-user__email m-link">' + row.CompanyName + '</a>\
								</div>\
							</div>';
					}

					return output;
				}
			}, {
				field: "ShipCountry",
				title: "Ship Country",
				width: 150,
				// callback function support for column rendering
				template: function (row:any) {
					return row.ShipCountry + ' - ' + row.ShipCity;
				}
			}, {
				field: "ShipAddress",
				title: "Ship Address",
				width: 200
			}, {
				field: "CompanyEmail",
				title: "Email",
				width: 150,
				template: function (row:any) {
					return '<a class="m-link" href="mailto:' + row.CompanyEmail + '">' + row.CompanyEmail + '</a>';
				}
			}, {
				field: "Status",
				title: "Status",
				// callback function support for column rendering
				template: function (row:any) {
					var status = {
						1: {'title': 'Pending', 'class': 'm-badge--brand'},
						2: {'title': 'Delivered', 'class': ' m-badge--metal'},
						3: {'title': 'Canceled', 'class': ' m-badge--primary'},
						4: {'title': 'Success', 'class': ' m-badge--success'},
						5: {'title': 'Info', 'class': ' m-badge--info'},
						6: {'title': 'Danger', 'class': ' m-badge--danger'},
						7: {'title': 'Warning', 'class': ' m-badge--warning'}
					};
					return '<span class="m-badge ' + status[row.Status].class + ' m-badge--wide">' + status[row.Status].title + '</span>';
				}
			}, {
				field: "Type",
				title: "Type",
				// callback function support for column rendering
				template: function (row:any) {
					var status = {
						1: {'title': 'Online', 'state': 'danger'},
						2: {'title': 'Retail', 'state': 'primary'},
						3: {'title': 'Direct', 'state': 'accent'}
					};
					return '<span class="m-badge m-badge--' + status[row.Type].state + ' m-badge--dot"></span>&nbsp;<span class="m--font-bold m--font-' + status[row.Type].state +'">' + status[row.Type].title + '</span>';
				}
			}, {
				field: "Actions",
				width: 110,
				title: "Actions",
				sortable: false,
				overflow: 'visible',
				template: function (row:any) {
					var dropup = (row.getDatatable().getPageSize() - row.getIndex()) <= 4 ? 'dropup' : '';

					return '\
						<div class="dropdown '+ dropup +'">\
							<a href="#" class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="dropdown">\
                                <i class="la la-ellipsis-h"></i>\
                            </a>\
						  	<div class="dropdown-menu dropdown-menu-right">\
						    	<a class="dropdown-item" href="#"><i class="la la-edit"></i> Edit Details</a>\
						    	<a class="dropdown-item" href="#"><i class="la la-leaf"></i> Update Status</a>\
						    	<a class="dropdown-item" href="#"><i class="la la-print"></i> Generate Report</a>\
						  	</div>\
						</div>\
						<a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
							<i class="la la-edit"></i>\
						</a>\
						<a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
							<i class="la la-trash"></i>\
						</a>\
					';
				}
			}]
		});

		var query = datatable.getDataSourceQuery();

		$('#m_form_search').on('keyup', function (e) {
			// shortcode to datatable.getDataSourceParam('query');
			var query = datatable.getDataSourceQuery();
			query.generalSearch = $(this).val().toLowerCase();
			// shortcode to datatable.setDataSourceParam('query', query);
			datatable.setDataSourceQuery(query);
			datatable.load();
		}).val(query.generalSearch);

		$('#m_form_status').on('change', function () {
			// shortcode to datatable.getDataSourceParam('query');
			var query = datatable.getDataSourceQuery();
			query.Status = $(this).val().toLowerCase();
			// shortcode to datatable.setDataSourceParam('query', query);
			datatable.setDataSourceQuery(query);
			datatable.load();
		}).val(typeof query.Status !== 'undefined' ? query.Status : '');

		$('#m_form_type').on('change', function () {
			// shortcode to datatable.getDataSourceParam('query');
			var query = datatable.getDataSourceQuery();
			query.Type = $(this).val().toLowerCase();
			// shortcode to datatable.setDataSourceParam('query', query);
			datatable.setDataSourceQuery(query);
			datatable.load();
		}).val(typeof query.Type !== 'undefined' ? query.Type : '');

		$('#m_form_status, #m_form_type').selectpicker();
	};

	return {
		// public functions
		init: function () {
			demo();
		}
	};
}();

jQuery(document).ready(function () {
	DatatableColumnRenderingDemo.init();
});