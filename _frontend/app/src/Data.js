
export default {
	// baseUrl: "http://localhost:9000",
	baseUrl: "",
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
		bonusDay: 0,
		info: "",
	},
	
	price: {
		1: window.price.one || 0,
		3: window.price.three || 0,
		6: window.price.six || 0,
		12: window.price.twelve || 0
	},
	
	inputCourse: "",
	inputVideo: "",
	
	course: window.course,
	
	videos: window.videos,
	
	category: window.category,
	
	software: window.software,
	
	courses: window.courses,
	
	relatedCourses: window.relatedCourses,
	
	indexCourse: window.indexCourse
}

