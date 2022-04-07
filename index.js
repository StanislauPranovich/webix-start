function dataReading(id) {
	let values = $$("main_data").getItem(id);
	$$("main_form").setValues(values);
}

function editData() {
	let form = $$("main_form");
	let table = $$("main_data");
	let formData = form.getValues();
	if (formData.id) {
		table.updateItem(formData.id, formData)
	} else {
		table.add(formData);
	}
}

function sortByTitle(a, b) {
	a = a.title.toString().length;
	b = b.title.toString().length;
	return a > b ? 1 : (a < b ? -1 : 0);
}

function sortByVotes(a, b) {
	a = +a.votes.replace(',', '.');
	b = +b.votes.replace(',', '.');
	return a > b ? 1 : (a < b ? -1 : 0);
}

function sortByRank(a, b) {
	a = +a.rank;
	b = +b.rank;
	return a > b ? 1 : (a < b ? -1 : 0);
}

function sortByYear(a, b) {
	a = +a.year;
	b = +b.year;
	return a > b ? 1 : (a < b ? -1 : 0);
}

let header = {
	view: "toolbar",
	css: "webix_dark",
	cols: [
		{
			view: "label",
			label: "My App"
		},
		{
			view: "button",
			type: "icon",
			icon: "wxi-user",
			label: "Profile",
			autowidth: true,
			popup: "menu",
			css: "webix_transparent"
		},
	],
	padding: 10
};

let mainList = {
	rows: [
		{
			view: "list",
			data: ["Dashboard", "Users", "Products", "Admin"],
			autoheight: true,
			css: "window_selection",
			select: true,
			on: {
				onAfterSelect: function (id) {
					$$(id).show();
				}
			},
		},
		{},
		{
			view: "template",
			template: "<span class = 'fas fa-check'></span> <span class='connect'>Connected</span>",
			autoheight: true,
			css: "template_style"
		}
	],
	maxWidth: 200,
	css: "main_list_background"
};

let mainDataTable = {
	view: "datatable",
	id: "main_data",
	url: "data/data.js",
	scroll: 'y',
	select: true,
	autowidth: true,
	columns: [
		{ id: "rank", header: "", sort: sortByRank, css: "main_datatable_first_column" },
		{ id: "title", header: ["Film Title", { content: "textFilter" }], width: 470, sort: sortByTitle },
		{ id: "year", header: ["Released", { content: "textFilter" }], sort: sortByYear },
		{ id: "votes", header: ["Votes", { content: "textFilter" }], sort: sortByVotes },
		{ id: 'del', header: "", template: "{common.trashIcon()}" }
	],
	on: {
		onAfterSelect: dataReading,
	},
	onClick: {
		"wxi-trash": function (e, id) {
			this.remove(id);
			return false;
		}
	},
	hover: "datatable_hover"
};

let mainForm = {
	view: "form",
	id: "main_form",
	elements: [
		{
			rows: [
				{ template: "Edit Films", type: "section" },
				{ view: "text", label: "Title", name: "title", invalidMessage: "'Title' must be filled in" },
				{ view: "text", label: "Year", name: "year", invalidMessage: "'Year' between 1970 and current" },
				{ view: "text", label: "Rating", name: "rating", invalidMessage: "'Rating' can't be empty or 0" },
				{ view: "text", label: "Votes", name: "votes", invalidMessage: "'Votes' must be less than 100000" },
			],
			margin: 10
		},
		{
			cols: [
				{
					view: "button",
					value: "Add new",
					css: "webix_primary",
					click() {
						let form = $$("main_form");
						if (form.validate()) {
							webix.message("Validation is successful!");
							let item = form.getValues();
							$$("main_data").add(item);
						}
					},
				},
				{
					view: "button",
					value: "Clear",
					click() {
						webix.confirm({
							title: "Clearing the form",
							text: "Do you want to clear form data?",
						}).then(
							() => {
								let mainForm = $$("main_form");
								mainForm.clear();
								mainForm.clearValidation();
							}
						)
					}
				}
			],
		},
		{
			cols: [
				{
					view: "button",
					value: 'Edit',
					click: editData
				},
				{}
			]
		},
		{},
	],
	rules: {
		title: webix.rules.isNotEmpty,
		year: value => 1970 <= value && value <= 2022,
		rating: value => webix.rules.isNotEmpty && 0 < value && value <= 10,
		votes: value => 0 <= value && value <= 100000,
	}
};


let usersList = {
	rows: [{
		cols: [
			{
				view: "text",
				id: "users_list_input",
				on: {
					"onTimedKeyPress": function () {
						let value = this.getValue().toLowerCase();
						$$("users_list").filter(function (obj) {
							return obj.name.toLowerCase().indexOf(value) !== -1;
						})
					}
				}
			},
			{
				view: "button",
				value: "Sort asc",
				css: "webix_primary",
				autowidth: true,
				click() {
					$$("users_list").sort("name", "asc", "string");
				}
			},
			{
				view: "button",
				value: "Sort desc",
				css: "webix_primary",
				autowidth: true,
				click() {
					$$("users_list").sort("name", "desc", "string");
					console.log($$("users.list"));
				}
			}
		],
	},
	{
		view: "list",
		id: 'users_list',
		url: "data/users.js",
		template: "#name# from #country# <span class='remove-btn'>X</span>",
		onClick: {
			"remove-btn": function (e, id) {
				this.remove(id);
				return false;
			}
		},
		ready: function () {
			$$("users_list").data.each(
				function (obj) {
					if (obj.id <= 5) {
						obj.$css = 'users_list_highlight'
					}
				}
			)
		},
	},
	]
}

let usersChart = {
	view: "chart",
	id: "users_chart",
	url: "data/users.js",
	type: "bar",
	value: "#age#",
	xAxis: "#age#"
}

let products = {
	view: "treetable",
	id: "products_tree",
	columns: [
		{ id: "id", header: "", width: 50 },
		{
			id: "title",
			header: "Title",
			width: 250,
			template: "{common.treetable()} #title#"
		},
		{ id: "price", header: "Price", width: 200 }
	],
	select: "row",
	url: "data/products.js",
	scroll: false,
	ready: function() {
		$$("products_tree").openAll();
	}
};

let main = {
	cells: [
		{ id: "Dashboard", cols: [mainDataTable, mainForm] },
		{ id: "Users", rows: [usersList, usersChart] },
		{ id: "Products", rows: [products] },
		{ id: "Admin" }
	]
}

let footer = {
	view: "template",
	template: "The software is provided by <a href='https://webix.com'>https://webix.com.</a> All rights reserved (c)",
	css: "text-align webix_template",
	height: 30,
};

webix.ui({
	view: "popup",
	id: "menu",
	width: 270,
	body: {
		view: "list",
		data: ["Settings", "Log Out"],
		autoheight: true
	}
})

webix.ui({
	rows: [
		header,
		{
			cols: [
				mainList,
				{ view: "resizer" },
				main
			]
		},
		footer,
	]
})
