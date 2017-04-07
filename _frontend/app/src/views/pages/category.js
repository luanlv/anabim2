import Inferno from 'inferno';
import Component from 'inferno-component'
import { Link } from 'inferno-router';
import Data from '../../Data'
import fn from '../../fn'

export default class Category extends Component {

	constructor(props) {
		super(props)
		this.state = {
			ready: false
		};

		this.redraw = this.redraw.bind(this);
		this.getCategory = this.getCategory.bind(this);
		if(this.props.params.cateID === Data.category.slug){
			this.state.ready = true;
		} else {
			this.getCategory(this.props.params.cateID)
		}

	}

	shouldComponentUpdate(nextProps, nextState) {

		if(nextProps.params.cateID !== this.props.params.cateID) {
			this.getCategory(nextProps.params.cateID)
		}
	}

	redraw(){
		this.setState({});
	}

	getCategory(cateID){
		var this2 = this;
		if(cateID !== Data.category.slug) {
			this2.setState({ready: false});
			$.ajax({
				type: "GET",
				url: "/api/getCourses/" + cateID,
				success: function(data){
					Data.category = data.category;
					Data.courses = data.courses;
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


		$('#context2 .menu .item')
			.tab({
				context: 'parent'
			});

		$('.special.cards .image').dimmer({
			on: 'hover'
		});

	}

	render() {
		if(!this.state.ready){
			var loading = function(){
				return (
					<div id="loading" className="socket">
						<div className="gel center-gel">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c1 r1">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c2 r1">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c3 r1">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c4 r1">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c5 r1">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c6 r1">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>

						<div className="gel c7 r2">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>

						<div className="gel c8 r2">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c9 r2">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c10 r2">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c11 r2">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c12 r2">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c13 r2">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c14 r2">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c15 r2">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c16 r2">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c17 r2">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c18 r2">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c19 r3">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c20 r3">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c21 r3">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c22 r3">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c23 r3">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c24 r3">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c25 r3">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c26 r3">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c28 r3">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c29 r3">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c30 r3">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c31 r3">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c32 r3">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c33 r3">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c34 r3">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c35 r3">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c36 r3">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>
						<div className="gel c37 r3">
							<div className="hex-brick h1"></div>
							<div className="hex-brick h2"></div>
							<div className="hex-brick h3"></div>
						</div>

					</div>
				)
			}
			return (<div style="margin-top: 300px">
				{loading()}
			</div>)
		} else {
			var this2 = this;
			var button = (Data.user.member === "pending") ? (
					<button className="ui large orange button"
									onClick={function () {
										$('#membership-info').modal('show')
									}}
					>Thông tin đăng ký</button>
				) : (
					<button className="ui large orange button "
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
									}}
					>Đăng ký học ngay</button>
				)
			return (
				<div id="main">
					<div className="ui segment noBor noRa noSha noPa noMa">
						<div style="background: #1485bd">
							<div className="ui container ">
								<div className="ui two column stackable grid" style="color: white !important; height: 250px;">
									<div className="column">
										<div className="ui breadcrumb white" >
											<Link to="/" className="section" >Trang chủ</Link>
											<div class="divider" style="display: inline"> / </div>
											Danh mục: [ <Link to={"/category/" + Data.category.slug } className="section" >{Data.category.name}</Link> ]
										</div>
										{/*<h3 className="ui header" style="color: white !important">Web Training and Tutorials</h3>*/}
										<div style="color: white !important" dangerouslySetInnerHTML={{__html: Data.category.description}}>

										</div>
										<div className="row " style="padding-top: 10px;">
											{button}
										</div>
									</div>
									<div className="column noPa"
											 style={'background-image: url("/image/get/' + Data.category.cover.path + '");'}>
										<div
											style="background: linear-gradient(to right, #1485bd 0%, transparent 30% , transparent 49%, transparent 70%, #1485bd 100%); width: 100%; height: 100%"></div>
									</div>
								</div>
							</div>
						</div>
						<div>
							<div className="ui container">
								<div className="ui segment noBor noSha noPa" style="margin: 30px auto">
									<div id="context2">
										<h2 className="header">Các video có trong danh mục <span style="color: red"> {Data.category.name} </span>:</h2>
										<hr/>
										<div className="ui active tab " data-tab="1">
											<div className="ui special stackable cards index-card">
												{Data.courses.map(function(el){
													return (
														<div className="card">
															<div className="blurring dimmable image">
																<div className="ui dimmer">
																	<div className="content">
																		<div className="center">
																			<Link to={"/course/" + el.slug} className="ui inverted button">Xem khóa học</Link>
																		</div>
																	</div>
																</div>
																<img src={"/image/get/" + el.cover.path}/>
															</div>
															<div className="content">
																<Link to={"/course/" + el.slug} className="header">{el.name}</Link>
																<div className="meta">
																	<span className="date">{el.author}</span>
																</div>
															</div>
															<div className="extra content">
																<a>
																	<i className="play icon"></i>
																	{/*{fn.secondToMinuteSecond(el.time)}*/}
																	Đang cập nhập
																</a>
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

						<div style=" background: linear-gradient(to right, black , #333);">
							<div className="ui container">
								<div className="ui stackable grid">
									<div className="twelve wide column grid noPa"
											 style='background: url("https://cdn.lynda.com/static/images/category/free-trial.png") no-repeat center black; background-size:100% 100%; height: 350px; overflow: hidden'>
										<div
											style="width: 100%; height: 100%; background: linear-gradient(to right, rgba(0,0,0, 0.9) 10%, rgba(0,0,0, 0.4)); /* Standard syntax */">
											<div className="ui header"
													 style=" color: white !important; line-height: 40px; padding: 20px 50px; font-size: 24px">
												Khuyến mãi
											</div>
											<div style=" color: white !important; line-height: 40px; padding-left: 50px; font-size: 18px">
												Anabim đang trong đợt khuyến mãi, đăng ký càng lâu, giá càng giảm
											</div>
											<div style=" color: white !important; line-height: 40px; padding-left: 50px">
												{ button }
											</div>
										</div>
									</div>
									<div className="four wide column grid">

										<div className="ui inverted relaxed divided list" style="margin-top: 30px">
											<div className="item">
												<i className="huge inverted history middle aligned icon"></i>
												<div className="content">
													<a className="header">XEM KHÔNG GIỚI HẠN</a>
													<div className="description">Xem không giới hạn  tất cả video có trên thư viện.
													</div>
												</div>
											</div>
											<div className="item">
												<i className="huge inverted student middle aligned icon"></i>
												<div className="content">
													<a className="header">GIÁO VIÊN KINH NGHIỆM</a>
													<div className="description">Học từ giảng viên có nhiều kinh nghiệm trong linh vực.</div>
												</div>
											</div>
											<div className="item">
												<i className="huge inverted laptop middle aligned icon"></i>
												<div className="content">
													<a className="header">HỌC TẬP MỌI NƠI</a>
													<div className="description">Học tập mọi lúc, mọi nơi, trên mọi thiết bị.</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		}
	}
}
