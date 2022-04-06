let small_film_set = [
	{ id: 1, title: "The Shawshank Redemption", year: 1994, votes: 678790, rating: 9.2, rank: 1, category: "Thriller" },
	{ id: 2, title: "The Godfather", year: 1972, votes: 511495, rating: 9.2, rank: 2, category: "Crime" },
	{ id: 3, title: "The Godfather: Part II", year: 1974, votes: 319352, rating: 9.0, rank: 3, category: "Crime" },
	{ id: 4, title: "The Good, the Bad and the Ugly", year: 1966, votes: 213030, rating: 8.9, rank: 4, category: "Western" },
	{ id: 5, title: "Pulp fiction", year: 1994, votes: 533848, rating: 8.9, rank: 5, category: "Crime" },
	{ id: 6, title: "12 Angry Men", year: 1957, votes: 164558, rating: 8.9, rank: 6, category: "Western" }
];

let header = {
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
			css: "webix_transparent white_button"
		}
	],
	css: "header"
};

let mainList = {
	rows: [
		{
			view: "list",
			data: ["Dashboard", "Users", "Products", "Locations"],
			autoheight: true,
			css: "window_selection"
		},
		{},
		{
			view: "template",
			template: "<span class = 'fas fa-check'></span> <span class='connect'>Connected</span>",
            autoheight:true,
			css: "template_style"
		}
	],
	width: 200,
	css: "main_list_background"
};

let mainDataTable = {
	view: "datatable",
	autoConfig: true,
	data: small_film_set,
	scroll: false,
	minWidth: 730,
	maxWidth: 1060
};

let mainForm = {
	view: "form",
	elements: [
		{
			rows: [
				{ template: "Edit Films", type: "section" },
				{ view: "text", label: "Title"},
				{ height: 10},
				{ view: "text", label: "Year"},
				{ height: 10},
				{ view: "text", label: "Rating"},
				{ height: 10},
				{ view: "text", label: "Votes"},
			],
		},
		{
			cols: [
				{
					view: "button",
					value: "Add new",
					css: "webix_primary",
				},
				{
					view: "button",
					value: "Clear"
				}
			],
			margin: 10
		},
		{},
	],
	width: 270,
	autoheight: true
};

let footer = {
	view: "template",
	template: "The software is provided by <a href='https://webix.com'>https://webix.com.</a> All rights reserved (c)",
	css: "text-align webix_template",
	height: 30,
};

webix.ui({
	rows: [
		header,
		{
			cols: [
				mainList,
				{ view: "resizer" },
				mainDataTable,
				mainForm
			]
		},
		footer,
	]
})