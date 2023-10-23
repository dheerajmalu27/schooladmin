//== Class definition

var DatatableHtmlTableDemo = function () {
	//== Private functions

	// demo initializer
	var demo = function () {

		var datatable = $('.m-datatable').mDatatable({
			columns: [
				{
					field: "Deposit Paid",
					type: "number"
				},
				{
					field: "Order Date",
					type: "date",
					format: "YYYY-MM-DD"
				},
				{
					field: "Name",
					 template: function (row:any) {
					console.log(row);
					return '<a href="#" (click)="detailProfile('+row.Name+')" [routerLink]="['+'search'+']">'+row.Name+'</a>';
				},
				
			},
			{
				field: "Actions",
				width: 110,
				title: "Actions",
				sortable: false,
				overflow: 'visible',
				template: function (row:any) {
					var dropup = (row.getDatatable().getPageSize() - row.getIndex()) <= 4 ? 'dropup' : '';

					return '\
						<div class="dropdown ' + dropup + '">\
							<a href="#" class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="dropdown">\
                                <i class="la la-ellipsis-h"></i>\
                            </a>\
						  	<div class="dropdown-menu dropdown-menu-right">\
						    	<a class="dropdown-item" href="#"><i class="la la-edit"></i> Edit Details</a>\
						    	<a class="dropdown-item" href="#"><i class="la la-leaf"></i> Update Status</a>\
						    	<a class="dropdown-item" href="#"><i class="la la-print"></i> Generate Report</a>\
						  	</div>\
						</div>\
						<a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="View ">\
                            <i class="la la-edit"></i>\
                        </a>\
					';
				}
			}
			]
		});

		var query = datatable.getDataSourceQuery();

		$('#m_form_search').on('keyup', function (e) {
			datatable.search($(this).val().toLowerCase());
		}).val(query.generalSearch);

	};

	return {
		//== Public functions
		init: function () {
			// init dmeo
			demo();
		}
	};
}();

jQuery(document).ready(function () {
	DatatableHtmlTableDemo.init();
});