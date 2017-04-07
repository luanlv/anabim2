import Inferno from 'inferno';
import Component from 'inferno-component'
import { Link } from 'inferno-router';
import Data from '../../Data'

export default class Home extends Component {
	constructor() {
		super()
		this.state = {
			tab: 0
		}
		this.redraw = this.redraw.bind(this);
		this.getIndexCourses = this.getIndexCourses.bind(this);
		this.getIndexCourses()
	}

	componentDidMount() {

		$('#context2 .menu .item')
			.tab({
				context: 'parent'
			});

		$('.special.cards .image').dimmer({
			on: 'hover'
		});

		$('.ui.example').dimmer({
			on: 'hover'
		})

		$('.tabular.menu .item').tab();

		$('.ui.embed').embed();

		$('#video-background').html('<source src="http://video.vnguy.com/video.mp4" type="video/mp4" />');

	}

	shouldComponentUpdate(nextProps, nextState) {
			console.log("shouldComponentUpdate");
		if(!window.initIndexCourse) {
			this.getIndexCourses()
		}

	}

	getIndexCourses(){
		var this2 = this;
		if(!window.initIndexCourse) {
			this2.setState({ready: false});
			$.ajax({
				type: "GET",
				url: "/api/indexCourse/get",
				success: function(data){
					window.initIndexCourse = true;
					Data.indexCourse = data;
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


	redraw(){
		this.setState({});
	}

	render() {
		var this2 = this;
		var button = (Data.user.member === "membership")?(""):((Data.user.member === "pending")?(
				<button className="ui large orange button"
								onClick={function(){
									$('#membership-info').modal('show')
								}}
				>Thông tin đăng ký</button>
			):(
				<button className="ui large orange button "
								onClick={function(){
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
								}}
				>Đăng ký học ngay</button>)
			);

		return (
			<div id="main">
				<div id="slider">
					<div className="video-image"></div>
					<div className="ui container">
						<div className="ui grid">
							<div className="ten wide column">
								<div className="ui stackable grid index-1">
									<div className="ten wide column">
											<h1>Việc tự học sẽ mang lại cho bạn cả một gia tài</h1>
									</div>
									<div className="six wide column"></div>
								</div>
							</div>
							<div className="six wide column index-1">
								<div className="index-icon"  style="margin-top: 10px;">
									<a target="_blank" href="https://facebook.com/daotaokientrucxaydung/"><i className="circular facebook icon pull-right" style="background: white !important;"></i></a>
									<a target="_blank" href="https://plus.google.com/105729788429368018982"><i className="circular google icon pull-right" style="background: white !important;"></i></a>
								</div>
							</div>
						</div>

					</div>

					<video autoplay loop id="video-background"  muted>

					</video>
				</div>

				<div className="main">


					<div className="ui container segment noBor noSha" style="margin: 100px auto !important">
						<div className="ui three column stackable grid">
							<div className="column ">
								<div className="centerInside"><i className="huge history icon "></i></div>
								<div className="centerInside" style="font-size: 20px; font-weight: bold">XEM KHÔNG GIỚI HẠN</div>
								<div className="centerInside" style="text-align: center">
									Xem không giới hạn  tất cả video có trên thư viện.
								</div>
							</div>
							<div className="column">
								<div className="centerInside"><i className="huge student icon "></i></div>
								<div className="centerInside" style="font-size: 20px; font-weight: bold">GIÁO VIÊN KINH NGHIỆM</div>
								<div className="centerInside" style="text-align: center">
									Học từ giảng viên có nhiều kinh nghiệm trong linh vực.
								</div>
							</div>
							<div className="column">
								<div className="centerInside"><i className="huge laptop icon "></i></div>
								<div className="centerInside" style="font-size: 20px; font-weight: bold; ">HỌC TẬP MỌI NƠI</div>
								<div className="centerInside" style="text-align: center">
									Học tập mọi lúc, mọi nơi, trên mọi thiết bị.
								</div>
							</div>
						</div>
					</div>


					<div id="slider2" style="background: url('/assets/img/5.jpg') no-repeat center #eee;">
						<div className="hero-img">
							<div className="ui container">
								<div className="ui stackable grid">
									<div className="ui ten wide column index-2" >
										<div className="ui segment noBor noSha noBa" >
											<div className="ui icon input" style="width: 100%">
												<input type="text" placeholder="BẠN MUỐN HỌC GÌ ?" />
													<i className="circular search link icon"></i>
											</div>

											<div className="ui segment" style="height: 300px; background: rgba(255,255,255,0.7)">
												<div className="ui three column grid">
													<div className="column">
														<div className="ui list index-3">
															{window.softs.map(function(el, index){
																if(index%3 === 0){
																	return (
																		<Link to={"/software/" + el.slug} className="item centerInside" style="height: 35px; ">
																			<img src={"/image/get/" + el.cover.path} alt="" width={35} height={35} style="margin-right: 5px; float: left"/>
																			<span style="line-height: 35px; font-size: 20px">{el.name}</span>
																		</Link>
																	)
																} else {
																	return ""
																}
															})
															}
														</div>
													</div>
													<div className="column">
														<div className="ui list index-3">
															{window.softs.map(function(el, index){
																if(index%3 === 1){
																	return (
																		<Link to={"/software/" + el.slug} className="item centerInside" style="height: 35px; ">
																			<img src={"/image/get/" + el.cover.path} alt="" width={35} height={35} style="margin-right: 5px; float: left"/>
																			<span style="line-height: 35px; font-size: 20px">{el.name}</span>
																		</Link>
																	)
																} else {
																	return ""
																}
															})
															}
														</div>
													</div>
													<div className="column">
														<div className="ui list index-3">
															{window.softs.map(function(el, index){
																if(index%3 === 2){
																	return (
																		<Link to={"/software/" + el.slug} className="item centerInside" style="height: 35px; ">
																			<img src={"/image/get/" + el.cover.path} alt="" width={35} height={35} style="margin-right: 5px; float: left"/>
																			<span style="line-height: 35px; font-size: 20px">{el.name}</span>
																		</Link>
																	)
																} else {
																	return ""
																}
															})
															}
														</div>
													</div>
												</div>
											</div>

										</div>

									</div>
									<div className="ui six wide column index-1" >
									</div>
								</div>
							</div>
						</div>

					</div>

					<div className="ui container segment noBor noSha" style="margin: 40px auto !important">
						<div className="row centerInside">
							{ button }
						</div>
					</div>

					<div className="ui container segment noBor noSha">
						<div className="row">
							{window.initIndexCourse?(<div id="context2">
									<div className="ui secondary pointing menu centerInside index-tab">
										{Data.indexCourse.value.map(function(el, index){
											return (<a className={"item " + ((this2.state.tab === index)?"active":"")} data-tab={index}
																 onClick={function(){
																	 this2.setState({tab: index});
																 }}
											>{el.category.name}</a>)
										})}

									</div>
									{Data.indexCourse.value.map(function(el, index){
										return [
											<div className={"ui tab " + ((this2.state.tab === index)?"active":"")} data-tab={index}>
												<div className="ui special stackable cards index-card">
													{el.courses.map(function(sel, sindex){
														return (
															<div className="card">
																<div className="blurring dimmable image">
																	<div className="ui dimmer">
																		<div className="content">
																			<div className="center">
																				<Link to={"/course/"  +sel.slug} className="ui inverted button">Xem khóa học</Link>
																			</div>
																		</div>
																	</div>
																	<img src={"/image/get/"  + sel.cover.path}/>
																</div>
																<div className="content">
																	<Link to={"/course/"  +sel.slug} className="header">{sel.name}</Link>
																	<div className="meta">
																		<span className="date">{sel.author}</span>
																	</div>
																</div>
																<div className="extra content">
																	<a>
																		<i className="play icon"></i>
																		Đang cập nhập
																	</a>
																</div>
															</div>
														)
													})}
												</div>
												<div style="height: 40px;">
													<Link to={"/category/" + el.category.slug}>
														<button className="ui button pull-right" style="margin-top: 30px; font-size: 20px !important;; line-height: 24x !important ">
															Xem tất cả
														</button>
													</Link>
												</div>
											</div>

										]
									})}



								</div>):("")}
							<div className="ui four column stackable grid">
								<div className="column grid ">
								</div>
								<div className="column grid "></div>
								<div className="column grid "></div>
								<div className="column grid "></div>
							</div>
						</div>

					</div>

					<div className="ui container segment noBor noSha" style="margin: 40px auto !important">
						<div className="row centerInside">
							{ button }
							{/*<button className="ui large basic button">Xem các khóa học</button>*/}
						</div>
					</div>


				</div>
			</div>
		)
	}
}
