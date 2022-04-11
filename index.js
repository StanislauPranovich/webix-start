webix.protoUI({
	name: "editlist"
}, webix.EditAbility, webix.ui.list);

function replaceCommaToDot(str) {
	return str.replace(',', '.');
}

function randomInteger(min, max) {
	let rand = min + Math.random() * (max + 1 - min);
	return Math.floor(rand);
}

const usersListSorting = (type) => {
	$$("users_list").sort("name", type, "string");
}

const jenre = new webix.DataCollection({
	url: "extra-js/categories.js",
})

const countries = new webix.DataCollection({
	url: "extra-js/countries.js",
})

const newUsersToList = new webix.DataCollection({
	url: "data/users.js"
})

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
	maxWidth: 120,
	css: "main_list_background"
};

let mainDataTable = {

	rows: [
		{
			view: "tabbar",
			id: "tabbar",
			value: "allFilms",
			options: [
				{ id: "allFilms", value: "All" },
				{ id: "oldFilms", value: "Old" },
				{ id: "modernFilms", value: "Modern" },
				{ id: "newFilms", value: "New" }
			],
			on: {
				onChange() {
					$$("main_data").filterByAll();
				}
			}
		},
		{
			view: "datatable",
			id: "main_data",
			url: "data/data.js",
			scroll: 'y',
			select: true,
			autowidth: true,
			columns: [
				{ id: "rank", header: "", sort: "int", css: "main_datatable_first_column" },
				{ id: "title", header: ["Film Title", { content: "textFilter" }], width: 470, sort: "string" },
				{ id: "categoryId", header: ["Category", { content: "selectFilter" }], sort: "string", collection: jenre },
				{ id: "rating", header: ["Rating", { content: "textFilter" }], sort: "int" },
				{ id: "votes", header: ["Votes", { content: "textFilter" }], sort: "int" },
				{ id: "year", header: "Released", sort: "int" },
				{ id: 'del', header: "", template: "{common.trashIcon()}" }
			],
			onClick: {
				"wxi-trash"(e, id) {
					this.remove(id);
					return false;
				}
			},
			hover: "datatable_hover",
			scheme: {
				$init(obj) {
					obj.categoryId = randomInteger(1, 4);
					obj.rating = replaceCommaToDot(obj.rating);
					obj.votes = replaceCommaToDot(obj.votes) * 1000;
				}
			}
		}
	]
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
							form.clear();
							form.clearValidation();
							$$("main_data").clearSelection();
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
								$$("main_data").clearSelection();
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
			},
			{
				view: "button",
				value: "Add new",
				css: "webix_primary",
				autowidth: true,
				click() {
					let obj = {};
					obj.name = newUsersToList.data.pull[randomInteger(1, newUsersToList.data.order.length)].name;
					obj.age = randomInteger(1, 100);
					obj.country = countries.data.pull[randomInteger(1, countries.data.order.length)].value;
					$$("users_list").add(obj);
				}
			}
		],
	},
	{
		view: "editlist",
		id: 'users_list',
		url: "data/users.js",
		template: "#name#, #age#, from #country# <span class='remove-btn'>X</span>",
		editable: true,
		editor: "text",
		editValue: "name",
		onClick: {
			"remove-btn"(e, id) {
				this.remove(id);
				return false;
			}
		},
		scheme: {
			$init(obj) {
				if (obj.age < 26) {
					obj.$css = "users_list_highlight";
				}
			}
		},
		rules: {
			"name": webix.rules.isNotEmpty
		}
	},
	]
}

let usersChart = {
	view: "chart",
	id: "users_chart",
	type: "bar",
	value: "#country#",
	xAxis: {
		template: "#value#"
	},
	yAxis: {
		start: 0,
		end: 10,
		step: 2
	}
}

let products = {
	view: "treetable",
	id: "products_tree",
	editable: true,
	columns: [
		{ id: "id", header: "", width: 50 },
		{
			id: "title",
			header: "Title",
			editor: "text",
			width: 250,
			template: "{common.treetable()} #title#"
		},
		{ id: "price", header: "Price", width: 200, editor: "text", fillspace: true }
	],
	select: "cell",
	url: "data/products.js",
	ready() {
		$$("products_tree").openAll();
	},
	rules: {
		"title": webix.rules.isNotEmpty,
		"price": webix.rules.isNumber
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

const users_chart = $$("users_chart");
users_chart.sync($$("users_list"), function () {
	users_chart.group({
		by: "country",
		map: {
			country: ["country", "count"]
		}
	},
	users_chart.sort("country", "asc")
	)
});

$$("main_data").registerFilter(
	$$("tabbar"),
	{
		columnId: "year", compare(value, filter, item) {
			switch (filter) {
				case "oldFilms":
					return value <= 1960;
					break;
				case "modernFilms":
					return value > 1960 && value < 1990;
					break;
				case "newFilms":
					return value >= 1990;
					break;
				default:
					return value;
					break;
			}
		}
	},
	{
		getValue(view) {
			return view.getValue();
		},
		setValue(view, value) {
			view.setValue(value);
		}
	}
)