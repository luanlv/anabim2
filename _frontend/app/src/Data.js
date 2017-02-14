
export default {
	
	user: {
		id: $('body').attr('id'),
		name: $('body').attr('name'),
		avatar: $('body').attr('avatar').length > 0 ? $('body').attr('avatar') : "/assets/avatar/2.jpg",
		member: $('body').attr('member'),
		price: 0,
	},
	test: "test",

	membership: {
		phone: "",
		month: 1,
		info: "",
	},
	
	price: {
		1: 799000,
		3: 1200000,
		6: 1789000,
		12: 2499000
	},
	
	course: window.course,
	
	videos: window.videos,
	
	category: window.category,
	
	courses: window.courses,
	
	indexCourse: window.indexCourse
}

