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
			css: "webix_transparent"
		}
	],
	css: "header"
};

let mainList = {
	rows: [
		{
			view: "list",
			data: ["Dashboard", "Users", "Products", "Locations"],
			autoheight: true
		},
		{},
		{
			view: "template",
			template: "<span class = 'fas fa-check'></span><span class = 'connect'>Connected</span>",
            autoheight:true,
            css: "template_style"
		}
	],
	width: 200,
	css: "list_background",
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
				{ view: "text", label: "Title", value: "" },
				{ view: "text", label: "Year", value: "" },
				{ view: "text", label: "Rating", value: "" },
				{ view: "text", label: "Votes", value: "" },
			],
			height: 230,
		},
		{
			cols: [
				{
					view: "button",
					value: "Add new",
					css: "webix_primary",
				},
				{ width: 10 },
				{
					view: "button",
					value: "Clear"
				}
			],
			width: 220
		},
	],
	height: 750
};

let footer = {
	view: "template",
	template: "The software is provided by <a href='https://webix.com'>https://webix.com.</a> All rights reserved (c)",
	css: "text-align webix_template"
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
		footer
	]
})