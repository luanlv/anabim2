import Inferno from 'inferno';
import Component from 'inferno-component'
import { Link } from 'inferno-router';
import Data from '../../Data'
import fn from '../../fn'
import moment from 'moment'

export default class Blog extends Component {

	constructor(props) {
		super(props);

		this.state = {
			ready: false,
			comment : "",
			comments : {
				init: false,
				list: []
			}
		};

		this.redraw = this.redraw.bind(this);
		this.getCourse = this.getCourse.bind(this)
		this.setComment = this.setComment.bind(this)

		if(this.props.params.courseId === Data.course.slug){
			this.state.ready = true;
		} else {
			this.state.comments = {
				init: false,
				list:[]
			}
			this.getCourse(this.props.params.courseId)
		}
	}


	shouldComponentUpdate(nextProps, nextState) {

		if(nextProps.params.videoId !== this.props.params.videoId) {
			this.setState({comments: {
				init: false,
				list: []
			}})
		} else {
		}
		if(nextProps.params.courseId !== this.props.params.courseId) {
			this.getCourse(nextProps.params.courseId)
		}

	}

	redraw(){
		this.setState({});
	}

	setComment(val){
		this.setState({comment: val});
	}

	getCourse(courseId){
		var this2 = this;
		if(courseId !== Data.course.slug) {
			this2.setState({ready: false});
			$.ajax({
				type: "GET",
				url: "/api/getCourse/" + courseId,
				success: function(data){
					Data.course = data.course;
					Data.videos = data.videos;
					this2.setState({ready: true});
				},
				error: function(data){
					// alert(data)
				}
			});
		} else {
			this2.setState({ready: true});
		}
	}

	componentDidMount() {

		$('body').scrollTop(0);

		$('.special.cards .image').dimmer({
			on: 'hover'
		});

		$('.ui.rating')
			.rating('disable')
		;

		$('.ui.accordion')
			.accordion({exclusive: false})
		;

		setTimeout(function(){
			$('.tabs.menu .item')
				.tab()
			;
		}, 300);
		console.log("load tab")

	}

	render() {
		if(!this.state.ready){
			var loading = function(){
				return (
					<div id="loading" class="socket">
						<div class="gel center-gel">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c1 r1">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c2 r1">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c3 r1">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c4 r1">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c5 r1">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c6 r1">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>

						<div class="gel c7 r2">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>

						<div class="gel c8 r2">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c9 r2">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c10 r2">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c11 r2">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c12 r2">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c13 r2">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c14 r2">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c15 r2">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c16 r2">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c17 r2">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c18 r2">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c19 r3">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c20 r3">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c21 r3">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c22 r3">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c23 r3">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c24 r3">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c25 r3">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c26 r3">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c28 r3">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c29 r3">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c30 r3">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c31 r3">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c32 r3">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c33 r3">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c34 r3">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c35 r3">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c36 r3">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
						<div class="gel c37 r3">
							<div class="hex-brick h1"></div>
							<div class="hex-brick h2"></div>
							<div class="hex-brick h3"></div>
						</div>
					</div>
				)
			}
			return (<div style="margin-top: 300px">
				{loading()}
			</div>)
		} else {

			var this2 = this;
			var category = [];
			Data.course.cateID.forEach(function (el) {
				category.push(fn.findById(window.categories, el))
			});
			var videoBySlug = fn.findVideoBySlug(Data.videos, this.props.params.videoId);
			var day = Math.floor(Math.random()*10)
			var key = "" + moment(moment().format()).add(day, 'days').unix() + day
			var linkVideo = ((videoBySlug.source == "anabim") ? ("http://video.vnguy.com/?v=" + fn.fixVideo(videoBySlug.link) + '&k=' + key) : ("https://www.youtube.com/embed/" + videoBySlug.link + "?autoplay=1"));
			var button = (Data.user.member === "pending") ? (
					<button class="ui large orange button"
									onClick={function () {
										$('#membership-info').modal('show')
									}}
					>Thông tin đăng ký</button>
				) : (
					<button class="ui large orange button "
									onClick={function () {
										if(Data.user.id.length === 0) {
											$('#dang-ky')
												.modal('show')
											;
										} else {
											if (Data.user.member == "none" || Data.user.member == "trialed" || Data.user.member == "membershiped") {
												$('.first.modal')
													.modal('show')
												;
											}
										}
									}
									}
					>Đăng ký học ngay</button>
				);
			return (
				<div id="main">
					{(Data.user.member !== "membership") ? (
							<div class="ui segment noBor noRa noSha noMa" style="background-color: teal !important;">
								<div class="ui container ">
									<div class="ui column stackable grid">
										<div class="ten wide column">
											<div style="color: white; ">

											</div>
										</div>
										<div class="six wide column">
											<div class="row centerInside">
												{ button }
											</div>
										</div>
									</div>
								</div>
							</div>
						) : ("")
					}
					<div class="ui segment noBor noRa noSha noMa" style="background-color: white !important;">
						<div class="ui container ">
							<div class="ui column  grid">
								<div class="sixteen wide column">
									<div class="ui breadcrumb">
										<Link to="/" >Trang chủ</Link>
										<div class="divider"> /</div>
										Danh mục: {category.map(function (el) {
											return [<Link to={"/category/" + el.slug} > [{el.name}] </Link>]
										})
										}
									</div>
									<Link to={"/course/" + Data.course.slug}><h1 class="noMa" style="margin-bottom: 10px !important;">
										{Data.course.name} </h1>
									</Link>
								</div>
							</div>
						</div>
					</div>

					<div class="ui segment noBor noRa noSha noMa"
							 style="background-color: #e5e5e5 !important; padding: 0px !important;">
						<div class="ui container ">
							<div class="ui column  stackable grid">
								<div class="eleven wide column" style="padding-top: 0 !important;">
									<div class="row">
										<div class="ui">
											{ (videoBySlug.kind === "free" || Data.user.member === "membership" || Data.user.member === "trial") ? (
													<iframe width="100%" height="556" id="player-frame" name="player-frame"
																	allowFullScreen and frameBorder="0"
																	src={linkVideo}>
													</iframe>
												) : (
													<div className="ui segment" style="height: 556px; background: #eee;">
														<div className="centerInside" style="margin-top: 150px; margin-bottom: 20px;">
															Đây là video dành riêng cho thành viên <span
															style="color: red; margin-left: 5px; margin-right: 5px"> Membership </span> của <b
															style="margin-left: 5px; margin-right: 5px"> Anabim </b>
														</div>
														<div className="centerInside">
															{ button }
														</div>
													</div>
												)
											}

										</div>

									</div>
									<div class="ui segment">
										<div id="context2">
											<div class="tabs ui secondary pointing menu ">
												<a class="item active" data-tab="1">Giới thiệu</a>
												<a class="item" data-tab="2">Tài liệu thực hành</a>
												<a class="item" data-tab="3">Sản phẩm học viên</a>
											</div>
											<div class="ui active tab " data-tab="1">
												<div class="ui column stackable grid">
													<div class="three wide column">
														<div class="ui tiny header centerInside">Giảng viên</div>
														<a href="#" class="" style="text-align: center; color: #333;">
															<div class="centerInside">
																<img class="ui circular image"
																		 src="/assets/img/author.jpg"/>
															</div>
															<div>{Data.course.author}</div>
														</a>
													</div>
													<div class="ten wide column">
														<div class="ui tiny header"></div>
														<div dangerouslySetInnerHTML={{__html: Data.course.description}}>
														</div>
													</div>
													<div class="three wide column ">
														<div class="centerInside">
															<div class="ui massive star rating" data-rating={Data.course.level} data-max-rating="3"></div>
														</div>
														<div class="centerInside">
															Cấp độ : {Data.course.level}
														</div>
														<div class="ui inverted grey segment centerInside " style="margin-bottom: 0px !important;">
															Đang cập nhập
														</div>
														<div class="noMa centerInside">Thời lượng học</div>
														<div class="ui inverted grey segment centerInside" style="margin-bottom: 0px !important;">
															1,066,481
														</div>
														<div class="noMa centerInside">Lượt xem</div>
													</div>
												</div>
											</div>
											<div class="ui  tab " data-tab="2" style="padding: 15px;">
												{
													(Data.user.member === "member")?
														(Data.course.documents?(<div dangerouslySetInnerHTML={{__html: Data.course.documents}}></div>):("")):
														(<div style="color:red">
															Bạn phải là membership
														</div>)
												}
											</div>
											<div className="ui tab" data-tab="3" style="padding: 15px;">
												{Data.course.sanpham?(<div dangerouslySetInnerHTML={{__html: Data.course.sanpham}}></div>):("")}
											</div>

										</div>
										<div class="ui four column stackable grid">
											<div class="column grid ">
											</div>
											<div class="column grid "></div>
											<div class="column grid "></div>
											<div class="column grid "></div>
										</div>
									</div>
								</div>
								<div class="five wide column " style="padding-left: 0 !important;">

									<div class="ui segment noPa noBor noSha course-info">
											<div class="tabs ui top attached tabular menu" style="">
												<a class="item active" data-tab="first">Video khóa học</a>
												<a class="item" data-tab="second"
													onClick={function(){
														if(!this2.state.comments.init){
															$.ajax({
																type: "GET",
																url: this2.props.params.videoId?("/api/comment/video/" + videoBySlug.id):("/api/comment/index/" + Data.course.id),
																success: function(data){
																	this2.setState({
																		comments: {
																			init: true,
																			list: data
																		}
																	});
																},
																error: function(data){
																	// alert(data)
																}
															});
														}
														setTimeout(function(){
															var el = document.getElementsByClassName("comments")[0];
															el.scrollTop = el.scrollHeight - el.scrollTop;
														}, 500);

													}}
												>Bình luận</a>
											</div>
											<div class="ui bottom attached tab segment active noPa" data-tab="first">
												<div class="ui styled fluid accordion">
													{Data.course.section.map(function (el, index) {
														return [
															<div class="title active" style="background: rgba(100, 100, 100, 0.1);">
																<i class=" dropdown icon"></i>
																{el}
															</div>,
															<div class="content active">
																<div class="ui relaxed divided list course-list" style="">
																	{Data.videos.filter(function (el) {
																		return el.section == index
																	}).map(function (video) {
																		return (
																			<Link to={"/course/" + this2.props.params.courseId + "/" + video.url}
																						className="item"
																						onClick={function () {
																							this2.redraw()
																						}}
																			>
																				{(video.kind === "free") ? (<i class=" play middle aligned icon"></i>) : (
																						<i class=" lock middle aligned icon"></i>)}
																				<div class="content">
																					<h4 class="header">{video.name}</h4>
																					<div class="description">{fn.secondToMinuteSecond(video.time)}</div>
																				</div>
																			</Link>
																		)
																	})
																	}
																</div>
															</div>
														]
													})
													}

												</div>
											</div>
											<div class="ui bottom attached tab segment" data-tab="second">
												{!this2.state.comments.init?("Loading"):(
														<div class="ui threaded comments"
														>
															<h3 class="ui dividing header">Comments</h3>
															{this2.state.comments.list.map(function(el){
																return (
																	<div class="comment">
																		<div class="content">
																			<a class="author">{el.name}</a>
																			<div class="metadata">
																				<span class="date">{fn.time(el.time)}</span>
																				{/*<a class="reply">Reply</a>*/}
																			</div>
																			<pre class="text">
																				{el.comment}
																			</pre>
																		</div>
																	</div>
																)
															})}


															<div class="ui form">
																<div class="field">
																	<textarea rows="2"
																						ref={(input) => { this.textInput = input; }}
																	></textarea>
																</div>
																<div class="ui blue labeled submit icon button"
																		 onClick={function(){
																			 var input = this2.textInput.value.trim();
																			 if(input.length >= 10){
																				 var newComment = {
																					 parentID : (this2.props.params.videoId?(videoBySlug.id):(Data.course.id)),
																					 comment : input,
																					 kind : (this2.props.params.videoId?"video":"index")
																				 };

																				 $.ajax({
																					 type: "POST",
																					 url: "/activity/comment",
																					 data: JSON.stringify(newComment),
																					 contentType: "application/json",
																					 dataType: "text",
																					 success: function(data){
																					 	newComment.id = parseInt(data);
																					 	newComment.time = new Date().getTime();
																					 	var list = this2.state.comments.list;
																					  list.push(newComment);
																						 var newComments = {
																							 init: true,
																							 list: list
																						 };
																						 this2.setState({
																							 comments: newComments
																						 });
																						 this2.textInput.value = '';
																						 this2.textInput.focus();
																					 },
																					 error: function(data){
																						 alert("Co loi")
																						 console.log(data)
																					 }
																				 });
																			 } else {
																				 alert("Bình luận phải có ít nhất 10 ký tự")
																			 }

																		 }}
																>
																	<i class="icon edit"></i> Thêm bình luận
																</div>
															</div>

														</div>
													)}


											</div>


									</div>

									<div class="ui segment noPa">
										<h3 class="ui top attached  header noBor noMa"
												style="border: 2px solid transparent !important;"
										>Khóa học liên quan</h3>
										<div class="ui attached celled list  noBor noMa related-courses"
												 style="background: white; border-radius: 0 0 5px 5px">
											{Data.relatedCourses.map(function(el){
												return (
													<div class="item">
														<div class="ui avatar index-card-wr">
															<div class="index-card-text">
																<div>
																	<p>{el.name}</p>
																	<div class="card-text">Cấp độ {el.level}</div>
																	<div class="card-button">
																		<Link to={"/course/" + el.slug}>
																			<button class="ui inverted button">
																				<i class="play icon"></i>
																				Xem khóa học
																			</button>
																		</Link>
																	</div>
																</div>
															</div>
															<img class="ui fluid rounded image"
																	 src={"/image/get/" + el.cover.path}
																	 style="height: 140px;"/>
														</div>
													</div>
												)
											})}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="ui segment">
						<div className="ui container">

						</div>
					</div>

				</div>
			)
		}
	}
}
