function dataReading(id) {
	let values = $$("main_data").getItem(id);
	$$("main_form").setValues(values);
}

function editAndAddData() {
	let form = $$("main_form");
	let table = $$("main_data");
	let formData = form.getValues();
	if (formData.id) {
		table.updateItem(formData.id, formData)
	} else {
		table.add(formData);
	}
}

function symbolChanges(i) {
	return +i.votes.replace(',', '.');
}

function sortByVotes(a, b) {
	a = symbolChanges(a);
	b = symbolChanges(b);
	return a > b ? 1 : (a < b ? -1 : 0);
}

const usersListSorting = (type) => {
	return $$("users_list").sort("name", type, "string");
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
				onAfterSelect(id) {
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
		{ id: "rank", header: "", sort: "int", css: "main_datatable_first_column" },
		{ id: "title", header: ["Film Title", { content: "textFilter" }], width: 470, sort: "string" },
		{ id: "year", header: ["Released", { content: "textFilter" }], sort: "int" },
		{ id: "votes", header: ["Votes", { content: "textFilter" }], sort: sortByVotes },
		{ id: 'del', header: "", template: "{common.trashIcon()}" }
	],
	on: {
		onAfterSelect: dataReading,
	},
	onClick: {
		"wxi-trash"(e, id) {
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
					value: "Save",
					css: "webix_primary",
					click() {
						let form = $$("main_form");
						if (form.isDirty()) {
							if (!form.validate()) {
								return false;
							}
							webix.message("Validation is successful!");
							form.save();
							form.clearValidation();
							form.clear();
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
					"onTimedKeyPress"() {
						const value = $$("users_list_input").getValue();
						$$("users_list").filter(obj => {
							const name = obj.name.toLowerCase();
							return name.indexOf(value) !== -1
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
					usersListSorting("asc");
				}
			},
			{
				view: "button",
				value: "Sort desc",
				css: "webix_primary",
				autowidth: true,
				click() {
					usersListSorting("desc");
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
			"remove-btn"(e, id) {
				this.remove(id);
				return false;
			}
		},
		ready: function () {
			const users_list = $$("users_list");
			users_list.data.each(obj => {
				users_list.getIndexById(obj.id) <= 5 ? obj.$css = 'users_list_highlight' : null;
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
		{ id: "price", header: "Price", fillspace: true }
	],
	select: "cell",
	url: "data/products.js",
	ready() {
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
	css: "text-align",
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

$$("main_form").bind($$("main_data"));
