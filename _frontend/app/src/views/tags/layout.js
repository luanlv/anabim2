import Inferno from 'inferno';
import Component from 'inferno-component'
import { Link } from 'inferno-router';
import Header from './header';
import Data from '../../Data'
import fn from '../../fn'

export default class Layout extends Component {
	constructor() {
		super();
		this.state = {
		};
		this.changeMonth = this.changeMonth.bind(this);
		this.change = this.change.bind(this);
		this.redraw = this.redraw.bind(this);
		this.membership = this.membership.bind(this);
		this.activeCode = this.activeCode.bind(this);
	}

	componentDidMount() {

		var $menu = $('#danhmuc');
		var firstMenu = $('#danhmuc').children('.item')[0];
		console.log($('.maintainHover').length)
		$menu.menuAim({
			activate: activateSubmenu,
			deactivate: deactivateSubmenu
		});

		$('.ui.dropdown')
			.dropdown({
				on: 'hover',
				onShow: function(text, value) {
					if($('.maintainHover').length < 1){
//                    firstMenu.addClass('maintainHover');
						activateSubmenu(firstMenu);
					}

				}
			})
		;

		function activateSubmenu(row) {
			var $row = $(row),
				submenuId = $row.data("submenuId"),
				$submenu = $("#" + submenuId),
				height = $menu.outerHeight(),
				width = $menu.outerWidth();

			var level = parseInt($row.attr('data-submenu-id'))
			// Show the submenu
			$submenu.css({
				display: "block",
				top: -1 - (level-1)*60,
				left: width - 6,  // main should overlay submenu
				height: height  // padding for main dropdown's arrow
			});

			// Keep the currently activated row's highlighted look
			$row.addClass("maintainHover");
		}

		function deactivateSubmenu(row) {

			var $row = $(row),
				submenuId = $row.data("submenuId"),
				$submenu = $("#" + submenuId);
			// Hide the submenu and remove the row's highlighted look
			$submenu.css("display", "none");
//        $row.find("a").removeClass("maintainHover");
			$row.removeClass("maintainHover");
		}

		$(document).click(function() {
			// Simply hide the submenu on any click. Again, this is just a hacked
			// together menu/submenu structure to show the use of jQuery-menu-aim.
//        $(".popover").css("display", "none");
//        $("a.maintainHover").removeClass("maintainHover");
		});


		$('.dang-nhap').click(function(){
			$('#dang-nhap')
				.modal('show')
			;
		});

		$('.dang-ky').click(function(){
			$('#dang-ky')
				.modal('show')
			;
		});

		$('.coupled.modal')
			.modal({
				allowMultiple: false
			});

		$('.second.modal')
			.modal('attach events', '.first.modal .button');

		if(Data.user.id.length > 0){


			$('#membership-info')
				.modal({
					onShow  : function(){
						$.ajax({
							type: "GET",
							url: "/membership",
							dataType: "text"
						}).done(function(data) {
							$('#membership-info-body').html(data);
							$('#membership-info-body').removeClass('loading');
						})
							.fail(function(error) {
								alert( error );
							});
					}
				});



			if(Data.user.member == "none" || Data.user.member == "trialed" || Data.user.member == "membershiped") {
				$('.first.modal')
					.modal('show')
				;
			}

			console.log(Data.videos)


		}

		$('.ui.checkbox')
			.checkbox()
		;

		var elem = document.getElementById("loading");
		elem.parentElement.removeChild(elem);

		if(this.props.params.email !== undefined) {
			$("#email").val(this.props.params.email)
		}
		if(this.props.params.name !== undefined) {
			$("#name").val(this.props.params.name)
		}

		if(this.props.params.exist !== undefined) {
			$('#dang-ky').modal('show');
		}
		if(this.props.params.confirmEmail !== undefined){
			$('#email-comfirm').modal('show');
		}
	}

	membership(){
		if(Data.user.id.length === 0) {
			$('#dang-ky')
				.modal('show')
			;
		} else {
			if (Data.user.member == "none" || Data.user.member == "trialed" || Data.user.member == "membershiped") {
				$('.first.modal')
					.modal('show')
				;
			} else {
				$('#membership-info').modal('show');
			}
		}
	}

	activeCode(){
		$('#activeCode')
			.modal('show')
		;
	}

	redraw(){
		this.setState({});
	}

	change(val) {
		alert("change! " + val)
	}
	changeMonth(num) {
		Data.membership.month= num;
		Data.membership.price= Data.price[num];
		console.log(Data.membership);
		this.setState({});
	}

	render() {
		var this2 = this;
		var link = function(slug, name){
			return <Link to={Data.baseUrl + "/course/" + slug}>{name}</Link>
		}
		return (
			<div>
				<div class="nav">
					<div class="ui inverted segment nav-top">
						<div class="ui container">
							<div class="ui inverted secondary menu">
								<a href="http://anabim.com/" target="_blank"  style="width: 120px !important; ">
									<img src="/assets/img/logo.jpg" alt="" width={120} height={42}/>
								</a>

								<a class="ui top left pointing dropdown item navbar" style="margin-right: 0px !important;">
									DANH MỤC
									<i class="dropdown icon"></i>
									<ul class="ui blue menu" id="danhmuc">
										<li class="item" data-submenu-id="1">
											<i class="dashboard icon"></i>
											KIẾN TRÚC SƯ
											<div id="1" class="popover">
												<div className="ui two column grid">
													<div className="column">
														<ul class="ui list">
															<li><Link to={Data.baseUrl + "/course/khoa-hoc-lam-quen-voi-revit"}>Làm Quen Với Revit (FREE)</Link></li>
															<li><Link to={Data.baseUrl + "/course/khoa-hoc-revit-architecture-nen-tang"}>Revit Arrchitecture Nền Tảng</Link></li>
															<li><Link to={Data.baseUrl + "/course/khoa-hoc-revit-architecture-nang-cao"}>Revit Arrchitecture Nâng Cao</Link></li>
															<li><Link to={Data.baseUrl + "/course/khoa-hoc-conceptual-massing"}>Revit Conceptual Mass</Link></li>
															<li><Link to={Data.baseUrl + "/course/khoa-hoc-revit-family-co-ban"}>Revit Family Cơ Bản</Link></li>
															<li><Link to={Data.baseUrl + "/course/khoa-hoc-revit-family-nang-cao"}>Revit Family Nâng Cao</Link></li>
															<li><Link to={Data.baseUrl + "/course/khoa-hoc-revit-family-addaptive-co-ban"}>Revit Family Adaptive Cơ Bản</Link></li>
															<li><Link to={Data.baseUrl + "/course/khoa-hoc-revit-family-adaptive-nang-cao"}>Revit Family Adaptive Nâng Cao</Link></li>
														</ul>
													</div>
													<div className="column">
														<ul class="ui list">
															<li>{link("khoa-hoc-dynamo-co-ban", "Autodesk Dynamo 2016")}</li>
															<li><Link to={Data.baseUrl + "/course/khoa-hoc-dynamo-nang-cao"}>Dynamo Nâng Cao</Link></li>
															<li><Link to={Data.baseUrl + "/course/khoa-hoc-formit-360"}>Autodesk Formit</Link></li>
															<li><Link to={Data.baseUrl + "/course/sketchup-co-ban"}>Sketchup Cơ Bản</Link></li>
															<li><Link to={Data.baseUrl + "/course/khoa-hoc-sketchup-nang-cao"}>Sketchup Nâng Cao</Link></li>
															<li><Link to={Data.baseUrl + "/course/khoa-hoc-autocad-2015-co-ban"}>Autocad 2015 Miễn Phí</Link></li>
															<li><Link to={Data.baseUrl + "/course/thiet-ke-gach-thong-gio-revit"}>Thiết Kế Gạch Thông Gió</Link></li>
														</ul>
													</div>
												</div>
											</div>
										</li>
										<li class="item" data-submenu-id="2">
											<i class="object ungroup icon"></i>
											KỸ SƯ MEP
											<div id="2" class="popover">
												<div className="ui two column grid">
													<div className="column">
														<ul class="ui list">
															<li><Link to={Data.baseUrl + "/course/khoa-hoc-lam-quen-voi-revit"}>Làm Quen Với Revit (FREE)</Link></li>
															<li>{link("khoa-hoc-revit-mep-co-ban", "Khóa học Revit MEP cơ bản")}</li>
															<li>{link("khoa-hoc-revit-mep-nang-cao", "Khóa Học Revit MEP Nâng Cao")}</li>
															<li>{link("khoa-hoc-family-mep-phan-1", "Family MEP")}</li>
														</ul>
													</div>
													<div className="column">
														<ul class="ui list">
															<li>{link("khoa-hoc-dynamo-co-ban", "Autodesk Dynamo 2016")}</li>
															<li>{link("khoa-hoc-dynamo-nang-cao", "Khóa học Dynamo nâng cao")}</li>
															<li>{link("khoa-hoc-autocad-2015-co-ban", "Autocad 2015 Miễn Phí")}</li>
														</ul>
													</div>
												</div>
											</div>
										</li>
										<li class="item" data-submenu-id="3">
											<i class="calculator icon"></i>
											KỸ SƯ KẾT CẤU
											<div id="3" class="popover">
												<div className="ui two column grid">
													<div className="column">
														<ul class="ui list">
															<li>{link("khoa-hoc-autocad-2015-co-ban", "Autocad 2015 Miễn Phí")}</li>
															<li>{link("khoa-hoc-lam-quen-voi-revit", "Làm Quen Với Revit (FREE)")}</li>
															<li>{link("khoa-hoc-revit-structure-co-ban", "Revit Structure Cơ Bản")}</li>
															<li>{link("khoa-hoc-robot-structural-co-ban", "Robot Structural Cơ Bản")}</li>
															<li>{link("Revit-Structure-Concrete", "Revit Structure Concrete")}</li>
														</ul>
													</div>
													<div className="column">
														<ul class="ui list">
															<li>{link("khoa-hoc-revit-structure-steel", "Revit Structure Steel")}</li>
															<li>{link("khoa-hoc-revit-family-structure", "Family Revit Structure")}</li>
															<li>{link("khoa-hoc-dynamo-co-ban", "Autodesk Dynamo 2016")}</li>
															<li>{link("khoa-hoc-dynamo-nang-cao", "Khóa học Dynamo nâng cao")}</li>
														</ul>
													</div>
												</div>
											</div>
										</li>
										<li class="item" data-submenu-id="4">
											<i class="cubes icon"></i>
											MÔ PHỎNG & PHÂN TÍCH NĂNG LƯỢNG
											<div id="4" class="popover">
												<div className="ui two column grid">
													<div className="column">
														<ul class="ui list">
															<li>{link("khoa-hoc-autocad-2015-co-ban", "Autocad 2015 Miễn Phí")}</li>
															<li>{link("khoa-hoc-lam-quen-voi-revit", "Làm Quen Với Revit (FREE)")}</li>
															<li>{link("khoa-hoc-ecotec-co-ban", "Autodesk Ecotec")}</li>
														</ul>
													</div>
													<div className="column">
														<ul class="ui list">
															<li>{link("khoa-hoc-vasari", "Autodesk Vasari")}</li>
															<li>{link("khoa-hoc-dynamo-co-ban", "Autodesk Dynamo 2016")}</li>
															<li>{link("khoa-hoc-dynamo-nang-cao", "Khóa học Dynamo nâng cao")}</li>
														</ul>
													</div>
												</div>
											</div>
										</li>
										<li class="item" data-submenu-id="5">
											<i class="cube icon"></i>
											KỸ SƯ CHẾ TẠO
											<div id="5" class="popover">
												<div className="ui two column grid">
													<div className="column">
														<ul class="ui list">
															<li>{link("khoa-hoc-autocad-2015-co-ban", "Autocad 2015 Miễn Phí")}</li>
															<li>{link("khoa-hoc-lam-quen-voi-revit", "Làm Quen Với Revit (FREE)")}</li>
														</ul>
													</div>
													<div className="column">
														<ul class="ui list">
															<li>{link("khoa-hoc-dynamo-co-ban", "Autodesk Dynamo 2016")}</li>
															<li>{link("khoa-hoc-dynamo-nang-cao", "Dynamo Nâng Cao")}</li>
														</ul>
													</div>
												</div>
											</div>
										</li>
										<li class="item" data-submenu-id="6">
											<i class="cube icon"></i>
											KỸ SƯ HẠ TẦNG KỸ THUẬT
											<div id="6" class="popover">
												<div className="ui two column grid">
													<div className="column">
														<ul class="ui list">
															<li>{link("khoa-hoc-autocad-2015-co-ban", "Autocad 2015 Miễn Phí")}</li>
															<li>{link("khoa-hoc-lam-quen-voi-revit", "Làm Quen Với Revit (FREE)")}</li>
															<li>{link("khoa-hoc-infrawork-360", "Khóa Học Infrawork 360")}</li>
														</ul>
													</div>
													<div className="column">

													</div>
												</div>
											</div>
										</li>
										<li class="item" data-submenu-id="7">
											<i class="cube icon"></i>
											ĐÀO TẠO BIM
											<div id="7" class="popover">
												<div className="ui two column grid">
													<div className="column">
														<ul class="ui list" >
															<li>{link("khoa-hoc-autocad-2015-co-ban", "Autocad 2015 Miễn Phí")}</li>
															<li>{link("khoa-hoc-lam-quen-voi-revit", "Làm Quen Với Revit (FREE)")}</li>
															<li>{link("khoa-hoc-dynamo-nang-cao", "Dynamo Nâng Cao")}</li>
															<li>{link("khoa-hoc-bim-glue", "Khóa Học BIM Glue")}</li>
															<li>{link("khoa-hoc-naviswork-phan-2", "Khóa Học Naviswork Phần 2")}</li>
														</ul>
													</div>
													<div className="column">
														<ul class="ui list">
															<li>{link("khoa-hoc-naviswork-co-ban", "Khóa Học Naviswork 2016")}</li>
														</ul>
													</div>
												</div>
											</div>
										</li>
									</ul>

								</a>
								<div class="item">
									<div class="ui icon input">
										<input type="text"
													 style="width: 500px;"
													 placeholder="Tìm kiếm khóa học muốn học..."/>
										<i class="search icon"></i>
									</div>
								</div>

								{(Data.user.id !== "")?(
									<div className="right menu">

										<div className="ui inverted circular item noPa" style="background: black; width: 50px">
											<div class="ui top right pointing dropdown icon button noPa noMa" style="background: black; width: 50px">
												<i className="inverted big alarm icon"></i>
												<div class="menu">
													<div class="item">Hiện chưa có thông báo nào</div>
												</div>
											</div>
										</div>

										<div className="ui inverted circular item noPa" style="background: black; width: 50px">
											<div class="ui top right pointing dropdown " >
												<a class="ui item "  >
													<span>{Data.user.name}</span>
												</a>
												<div class="menu">
													<a class="item" style="color: black !important"
														 onClick={function(){
															 this2.membership()
														 }}
													>
														<i class="tags icon"></i>
														Membership
													</a>
													<a href="/logout" class="item" style="color: black !important">
														<div class="ui black empty circular label"></div>
														Đăng xuất
													</a>
												</div>
											</div>
										</div>
									</div>
									):(<div class="right menu">


										<a class="ui item dang-nhap">
											Đăng nhập
										</a>
										<a class="ui item dang-ky" style="background-color: #008cc9">
											Đăng ký
										</a>
									</div>)}
							</div>

						</div>
					</div>
					<div class="ui inverted segment nav-bot">
						<div class="ui inverted  mini secondary pointing menu">
							<div class="ui container">
								<Link to="/" className="item">
									<i class="home icon"></i>
								</Link>
								<div class="right menu">

									{(Data.user.member === "member")?(""):(
											<a class="item"
												 onClick={this.activeCode}
											>
												Điền mã kích hoạt
											</a>
										)}


									<a class="red item"
										onClick={function(){
											this2.membership()
										}}
									>
										Membership
									</a>
								</div>

							</div>
						</div>
					</div>
				</div>

				{ this.props.children }

				<div id="footer">
					<div class="ui inverted segment noBor noSha noRa noMa footer-top">
						<div class="ui container">
							<div class="ui stackable grid">
								<div class=" twelve wide column">
									<div class="ui three column grid">
										<div class="column ">
											<h3>ANABIM EDUCATION</h3>
											<a>Khóa học online</a>
											<a>Khoác học offline</a>
											<a>Hướng dẫn thanh toán khóa học</a>
											<a>Hình ảnh</a>
											<a>Cộng đồng</a>
											<a>Về chúng tôi</a>
											<a>Liên hệ</a>
										</div>

										<div class="column">
											<h3>VĂN PHÒNG ANABIM</h3>
											<span>ANABIM CO,.LTD
 											<br/>36B ngõ 554 đường Trường Chinh, Đống Đa, Hà Nội.</span>
											<div>0975 622 789</div>
											<div>revithanoi@gmail.com</div>
											<div> www.anabim.com</div>
										</div>

										<div class="column ">
											<h3>HỖ TRỢ</h3>
											<div>
												Mr. Thùy - Kiến trúc
												<br/>
												01669053063
											</div>
											<div>
												Mr. Chiến - MEP
												<br/>
												0979 269 448
											</div>
											<div>
												Mr. Huy - Kết cấu
												<br/>
												0978 542 680
											</div>

											<div>
												Mr. Vượng - Doanh nghiệp
												<br/>
												0975 622 789
											</div>
										</div>
									</div>
								</div>

								<div class="four wide column ">
									<h3 class="centerInside">Connect</h3>
									<div class="row centerInside">
										<a target="_blank" href="https://facebook.com/daotaokientrucxaydung/"><i class="huge facebook square icon"></i></a>
										<a target="_blank" href="https://plus.google.com/105729788429368018982"><i class="huge google plus square icon"></i></a>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="ui inverted segment noBor noSha noRa noMa footer-bot">
						<div class="ui container">
							<div class="ui secondary  menu">
								<a class="active item">
									© 2017 Anabim.com, Inc.
								</a>
								<a class="item">
									Site Map
								</a>
								<a class="item">
									Privacy policy
								</a>
								<a class="item">
									Web Use Policy
								</a>
								<div class="right menu">
									<a class="ui item">
										ANABIM
										<i class="icons">
											<i class="angle double up icon"></i>
										</i>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div id="dang-nhap" class="ui modal">
					<div class="header" style="text-align: center">
						Đăng nhập
					</div>
					<div class="ui two column stackable segment grid noBor noSha">
						<div class="column">
							<form class="ui large form" action="/login" method="POST">
								<div class="ui stacked segment">
									<div class="field">
										<div class="ui left icon input">
											<i class="user icon"></i>
											<input type="text" name="username" id="username"  placeholder="E-mail"/>
										</div>
									</div>
									<div class="field">
										<div class="ui left icon input">
											<i class="lock icon"></i>
											<input type="password" name="password" id="password" placeholder="Mật khẩu"/>
										</div>
									</div>
									<button type="submit" class="ui fluid large teal submit button">Đăng nhập</button>
								</div>

								<div class="ui error message"></div>
							</form>
						</div>
						<div class="column centerInside">
							<div class="row ">
								<form action="/authenticate/facebook" method="post" class="centerInside" >
									<button class="ui facebook button" style="min-width: 70%;" >
										<i class="facebook icon"></i>
										Facebook
									</button>
								</form>
							</div>
							<div class="row" style="margin-top: 10px;">
								<form action="/authenticate/google" method="post" class="centerInside">
									<button type="submit" class="ui google plus button" style="min-width: 70%;">
										<i class="google plus icon"></i>
										Google Plus
									</button>
								</form>
							</div>
							<div class="row " style="margin-top: 30px;">
								<div class="ui centerInside">
									Quên mật khẩu? <a href="#"> Click vào đây</a>
								</div>
								<div class="ui centerInside" style="margin-top: 10px;">
									Chưa có tài khoản? <a class="dang-ky" href="#"> Đăng ký ngay</a>
								</div>
							</div>
						</div>
					</div>

				</div>

				<div id="dang-ky" class="ui modal">
					<div class="header" style="text-align: center">
						{(this.props.params.exist !== undefined)?("Email đã tồn tại, hãy chọn email khác"):("Đăng ký")}
					</div>
					<div class="ui two column stackable segment grid noBor noSha">
						<div class="column">
							<form class="ui large form" action="/signup" method="POST">
								<div class="ui stacked segment">
									<div class="field">
										<div class="ui left icon input">
											<i class="user icon"></i>
											<input type="text" name="name" id="name" placeholder="Tên"/>
										</div>
									</div>
									<div class="field">
										<div class="ui left icon input">
											<i class="user icon"></i>
											<input type="text" name="email" id="email" placeholder="E-mail"/>
										</div>
									</div>
									<div class="field">
										<div class="ui left icon input">
											<i class="lock icon"></i>
											<input type="password" name="password" id="password" placeholder="Mật khẩu"/>
										</div>
									</div>
									<button type="submit" class="ui fluid large teal submit button">Đăng ký</button>
								</div>

								<div class="ui error message"></div>
							</form>
						</div>
						<div class="column centerInside">
							<div class="row ">
								<form action="/authenticate/facebook" method="post" class="centerInside" >
									<button class="ui facebook button" style="min-width: 70%;" >
										<i class="facebook icon"></i>
										Facebook
									</button>
								</form>
							</div>
							<div class="row" style="margin-top: 10px;">
								<form action="/authenticate/google" method="post" class="centerInside">
									<button type="submit" class="ui google plus button" style="min-width: 70%;">
										<i class="google plus icon"></i>
										Google Plus
									</button>
								</form>
							</div>
							<div class="row " style="margin-top: 30px;">
								<div class="ui centerInside">
									Đã có tài khoản?<a class="dang-nhap" href="#"> Đăng nhập </a>
								</div>
							</div>
						</div>
					</div>

				</div>


				<div id="email-comfirm" class="ui small modal ">
					<div class="header" style="text-align: center">
						Kích hoạt email
					</div>
					<div class="ui"  style="text-align: center; padding: 30px 10px">
						Một email kích hoạt đã được gửi đến email <span style="color: red">{this2.props.params.email}</span>
						<br/>
						Bạn hãy check email và làm theo hướng dẫn để kích hoạt tài khoản
					</div>

				</div>

				<div id="activeCode" class="ui small modal ">
					<div class="header" style="text-align: center">
						Điền mã kích hoạt
					</div>
					<div class="ui"  style="text-align: center; padding: 30px 10px">
						<div className="ui two column stackable grid">
							<div className="column">
								<div className="ui form">
									<div className="field">
										<input type="text" placeholder="VD:3DAYS"
													 ref={(input) => { this.inputActiveCode = input; }}
										/>
									</div>
								</div>
							</div>
							<div className="column">
								<div className="ui form">
									<div className="field">
										<button class="ui primary button"
											onClick={function(){
												var code = this2.inputActiveCode.value.trim();
												console.log(code)
												if(code.length > 0){
													$.ajax({
														type: "POST",
														url: "/membership/activebycode/" + code,
														data: JSON.stringify(Data.membership),
														contentType: "application/json",
														dataType: "text"
													}).done(function () {
														Data.user.member = "trial"
														alert("Mã đã được chấp nhận")
														location.reload();
													})
														.fail(function () {
															alert("Sai mã kích hoạt");
														});
												} else {
													alert("Chưa điền mã kích hoạt")
												}
											}}
										>Kích hoạt</button>
									</div>
								</div></div>
						</div>

					</div>

				</div>

				<div className="ui container">

					<div class="ui first coupled modal thanh-vien-1">
						<div class="header" style="text-align: center">
							Đăng ký thành viên Membership
						</div>
						<div className="ui two column stackable padded grid">
							<div className="ui  column padded grid noPa">
								<div className="actions eight wide column" onClick={() => this.changeMonth(1)} >
									<div class=" button centerInside">
										<div class="ui huge horizontal statistic">
											<div class="value">
												1
											</div>
											<div class="label">
												Tháng
											</div>
										</div>
									</div>
								</div>
								<div className="actions eight wide column" onClick={() => this.changeMonth(3)}>
									<div class=" button centerInside">
										<div class="ui huge horizontal statistic">
											<div class="value">
												3
											</div>
											<div class="label">
												Tháng
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="ui  column padded grid noPa">
								<div className="actions eight wide column" onClick={() => this.changeMonth(6)}>
									<div class=" button centerInside">
										<div class="ui huge horizontal statistic">
											<div class="value">
												6
											</div>
											<div class="label">
												Tháng
											</div>
										</div>
									</div>
								</div>
								<div className="actions eight wide column" onClick={() => this.changeMonth(12)}>

									<div class=" button centerInside">
										<div class="ui huge horizontal statistic">
											<div class="value">
												1
											</div>
											<div class="label">
												Năm
											</div>
										</div>
									</div>

								</div>
							</div>


						</div>

						<div className="ui segment noMa">
							<div className="ui padded grid">

								<div className="five wide column ">
									<div className="row centerInside">
										<i className="huge thumbs outline up icon"></i>
									</div>
									<div className="row">
										<h3 style="text-align: center">Các lợi ích khi đăng ký membership</h3>
									</div>
								</div>

								<div className="eleven wide column">

									<div class="ui list">
										<div class="item">
											<i class="checkmark icon"></i>
											<div class="content">
												Được tham gia vào tất cả các khóa học có trên website
											</div>
										</div>
										<div class="item">
											<i class="checkmark icon"></i>
											<div class="content">
												Được giáo viên có kinh nghiệm hướng dẫn
											</div>
										</div>
										<div class="item">
											<i class="checkmark icon"></i>
											<div class="content">
												Các khóa học được cập nhập thường xuyên
											</div>
										</div>
										<div class="item">
											<i class="checkmark icon"></i>
											<div class="content">
												Đăng ký càng lâu giá càng giảm: <br/>
												<span style="margin-left: 20px; ">1 tháng: <span style="color: red">{fn.numberWithCommas(Data.price[1])} đ </span></span><br/>
												<span style="margin-left: 20px; ">3 tháng: <span style="color: red">{fn.numberWithCommas(Data.price[3])} đ</span></span><br/>
												<span style="margin-left: 20px; ">6 tháng: <span style="color: red">{fn.numberWithCommas(Data.price[6])} đ</span></span><br/>
												<span style="margin-left: 20px; ">1 năm: <span style="color: red">{fn.numberWithCommas(Data.price[12])} đ</span></span><br/>
											</div>
										</div>
									</div>

								</div>
							</div>
						</div>


					</div>




					<div class="ui large second coupled modal">

						<div class="header noBor" style="text-align: center">
							Đăng ký thành viên Membership
						</div>
						<div className="ui">
							<h3 style="text-align: center">Bạn đang đăng ký gói <span style="color: red">{(Data.membership.month === 12)?("1 năm"):(Data.membership.month + " tháng")}</span>, hay chọn hình thức thanh toán phía dưới</h3>
						</div>

							<div class="ui top attached tabular menu" style="margin-bottom: 10px">
								<a class="item active" data-tab="first">Thanh toán trực tiếp</a>
								<a class="item" data-tab="second">Chuyển khoản ngân hàng</a>
							</div>


							<div className="ui stackable grid">
								<div className="eight wide column">
									<div class="ui bottom attached tab segment noBor active" data-tab="first">
										<h2>Văn phòng ANABIM CO,.LTD</h2>
										<h3>Địa chỉ: 36B ngõ 554, Trường Chinh, Đống Đa, Hà Nội</h3>
										<h3>Điện thoại liên hệ: <span style="color:red">0975 622 789</span> - <span style="color:red">0949 958 898</span></h3>
									</div>
									<div class="ui bottom attached tab segment noBor" data-tab="second">
										<h2>NGÂN HÀNG TMCP NGOẠI THƯƠNG THĂNG LONG (VIETCOMBANK)</h2>
										<h3>Phòng giao dịch Kim Liên – Ô Chợ Dừa – 390 Xã Đàn – Hà Nội</h3>
										<h3>- Chủ tài khoản: <span style="color:red">PHẠM ĐỨC THỊNH</span></h3>
										<h3>- Số tài khoản: <span style="color:red">0491000064512</span></h3>
									</div>
								</div>
								<div className="eight wide column">
									<div class="ui form">
										<div className="field">
											<label>Số điện thoại (Chúng tôi sẽ liên lạc với số này khi thanh toán thành công)</label>
											<div class="field">
												<input type="text"
															 onKeyUp={function(e){
																 Data.membership.phone = $(e.target).val();
																 this2.redraw();
															 }}
												>{Data.membership.phone}</input>
											</div>
										</div>
										<div class="field">
											<label>Nội dung nhắn gửi</label>
											<textarea
												onKeyUp={function(e){
													Data.membership.info = $(e.target).val();
													this2.redraw();
												}}
											>{Data.membership.info}</textarea>
										</div>
									</div>
								</div>
							</div>

							<div className="ui segment noBor noMa">
								<div className="ui" style="height: 40px">
									<div class="ui form">
										<div class="inline field actions">
											<div class="ui labeled button" tabindex="0">
													<input type="text" placeholder="Mã giảm giá"
																 ref={(input) => { this.couponCode = input; }}
													/>
												<a class="ui basic inverted grey left pointing label"
													onClick={function(){
														$.get( "/coupon/get/" + this2.couponCode.value, function(data) {
															if(data) {
																console.log(data)
																console.log(data)
																Data.coupon = data
																this2.redraw()
															} else {
																alert( "Mã không tồn tại" );
															}
														})
															.fail(function() {
																alert( "Mã không tồn tại" );
															})
													}}
												>
													<i className="large checkmark icon noMa"></i>
												</a>
											</div>
											{Data.coupon?(<span style="color: blue">{fn.infoCoupon(Data.coupon, Data.membership)}</span>):("")}
											<button class="ui right floated  green approve button"
												onClick={function() {
													if(checkForm(Data.membership)){
														if(Data.coupon){
															Data.membership.coupon = Data.coupon;
															if(Data.coupon.kind === 3 ){
																console.log(fn.bonusDay(Data.coupon, Data.membership.month) + " day")
																Data.membership.bonusDay = fn.bonusDay(Data.coupon, Data.membership.month)
															}
															Data.membership.price = fn.priceWithCoupon(Data.coupon, Data.price[Data.membership.month], Data.membership.month);
														}
														$.ajax({
															type: "POST",
															url: "/membership/subscribe",
															data: JSON.stringify(Data.membership),
															contentType: "application/json",
															dataType: "text"
														}).done(function () {
															Data.user.member = "pending";
															$('#membership-info').modal('show')
														})
															.fail(function () {
																alert("error");
															});

													} else {
														$('.first.modal').modal('show');
													}
												} }

											>Xác nhận</button>
											<div class="ui red labeled right floated button" tabindex="0">
												<a class="ui basic inverted grey right pointing label">
													Total
												</a>
												<input style="color: red" disable type="text" value={fn.numberWithCommas(fn.priceWithCoupon(Data.coupon, Data.price[Data.membership.month], Data.membership.month)) + " đ"}/>
											</div>

										</div>

									</div>

								</div>
							</div>

							</div>


					<div id="membership-info" class="ui modal">
						<i class="close icon"></i>
						<div class="header" style="text-align: center">
							Thông tin membership
						</div>
						<div id="membership-info-body" className="ui loading segment noBor" style="min-height: 400px">

						</div>
					</div>

				</div>


			</div>
		);
	}
}

var checkForm = function(form){
	if(form.phone.match(/\d/g).length===10 || form.phone.match(/\d/g).length===11){
		return true
	} else {
		alert("Số điện thoại điền chưa đúng định dạng, ( phải có 10 hoặc 11 số )");
		return false;
	};

};
