import Inferno from 'inferno';
import Component from 'inferno-component'
import { Link } from 'inferno-router';
import Data from '../../Data'

export default class Layout3 extends Component {

	constructor() {
		super()
		this.state = {
		}
	}

	componentDidMount() {


		$('.special.cards .image').dimmer({
			on: 'hover'
		});

	}

	render() {
		return (
			<div id="main">
				<div class="ui segment noBor noRa noSha noMa" style="background-color: teal !important;">
					<div class="ui container ">
						<div class="ui column stackable grid">
							<div class="ten wide column">
								<div style="color: white; ">
									<p><strong>Start your free trial now</strong>, and begin learning software, business and creative skills—anytime, anywhere—with video instruction from recognized industry experts.</p>
								</div>
							</div>
							<div class="six wide column">
								<div class="row ">
									<button class="ui large orange button pull-right">Đăng ký học ngay</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="ui segment noBor noRa noSha noMa" style="background-color: white !important;">
					<div class="ui container ">
						<div class="ui column  grid">
							<div class="column">
								<div class="ui breadcrumb">
									<div class="section">Home</div>
									<div class="divider"> / </div>
									<div class="active section">Giảng viên</div>
								</div>

							</div>
						</div>
					</div>
				</div>

				<div class="ui stacked segment noRa noMa noPa"  style="">
					<div class="ui container">
						<div class="ui column stackable grid">
							<div class="four wide column" style="text-align: center">
								<h1 class="noMa" style="border-bottom: 2px solid #ddd; display: inline-block;">David Gassner</h1>
							</div>
						</div>
						<div class="ui column grid">
							<div class="four wide  column" style="padding-bottom: 40px !important;  ">
								<img class="ui fluid circular image" src="https://cdn.lynda.com/authors/87_250x250_thumb.jpg?v=1256910946" />
							</div>
							<div class="twelve wide column ">
								<div class="ui segment noBor noSha">
									<h3 class="ui header">Giới thiệu về giảng viên</h3>
									<p>David Gassner delivers training on Java, C#, PHP, and SQL, and speaks at conferences worldwide.
										<br />
											David Gassner is a senior staff author for lynda.com.
											<br />
												He was formerly the president and founder of Bardo Technical Services, an Adobe Solutions Network Training Provider. As an Adobe Certified Expert, he has written courseware and delivered extensive training in Flex, AIR, ColdFusion, Dreamweaver, and Flash. He works with many programming languages, including Java, C#, PHP, and SQL, has been a regular conference speaker, and was the author of Wiley's Flex 3 Bible and Flash Builder 4 and Flex 4 Bible.</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div style="background: #e5e5e5; padding-top: 30px;">
					<div class="ui container " style="margin: auto !important;">
						<div class="ui raised segments noPa noMa">
							<div class="ui segment">
								<p>Các khóa học</p>
							</div>
							<div class="ui segment">
								<div class="ui grid">
									<div class="four wide column">
										<div class="ui avatar index-card-wr">
											<div class="index-card-text index-card-text2">
												<div>
													<div class="card-button">
														<button class="ui inverted button">
															<i class="play icon"></i>
															Preview course
														</button>
													</div>
												</div>
											</div>
											<img class="ui fluid rounded image" src="https://cdn.lynda.com/courses/485599-636180090956206330_270x480_thumb.jpg" style="height: 140px;" />
										</div>
									</div>
									<div class="twelve wide column">
										<h4 class="ui header noMa">Visual Basic Essential Training</h4>
										<div style="margin-top: 5px;">Get started programming with Visual Basic using Visual Studio 2012 Experss for Windows Desktop.</div>
										<div style="margin-top: 5px;">
											<span class="meta-duration">4h 18m</span>
											<span class="meta-level">Beginner</span>
											<span class="meta-views">Views: 566,415</span>
											<span class="release-date">Dec 21, 2016</span>
										</div>
									</div>
								</div>
							</div>
							<div class="ui segment">
								<div class="ui grid">
									<div class="four wide column">
										<div class="ui avatar index-card-wr">
											<div class="index-card-text index-card-text2">
												<div>
													<div class="card-button">
														<button class="ui inverted button">
															<i class="play icon"></i>
															Preview course
														</button>
													</div>
												</div>
											</div>
											<img class="ui fluid rounded image" src="https://cdn.lynda.com/courses/487934-636081674221062200_270x480_thumb.jpg" style="height: 140px;" />
										</div>
									</div>
									<div class="twelve wide column">
										<h4 class="ui header noMa">Animations and Transitions in the Android SDK</h4>
										<div style="margin-top: 5px;">Get started programming with Visual Basic using Visual Studio 2012 Experss for Windows Desktop.</div>
										<div style="margin-top: 5px;">
											<span class="meta-duration">4h 18m</span>
											<span class="meta-level">Beginner</span>
											<span class="meta-views">Views: 566,415</span>
											<span class="release-date">Dec 21, 2016</span>
										</div>
									</div>
								</div>
							</div>
							<div class="ui segment">
								<div class="ui grid">
									<div class="four wide column">
										<div class="ui avatar index-card-wr">
											<div class="index-card-text index-card-text2">
												<div>
													<div class="card-button">
														<button class="ui inverted button">
															<i class="play icon"></i>
															Preview course
														</button>
													</div>
												</div>
											</div>
											<img class="ui fluid rounded image" src="https://cdn.lynda.com/courses/518053-636161001353689078_270x480_thumb.jpg" style="height: 140px;" />
										</div>
									</div>
									<div class="twelve wide column">
										<h4 class="ui header noMa">Java Design Patterns and APIs for Android</h4>
										<div style="margin-top: 5px;">Get started programming with Visual Basic using Visual Studio 2012 Experss for Windows Desktop.</div>
										<div style="margin-top: 5px;">
											<span class="meta-duration">4h 18m</span>
											<span class="meta-level">Beginner</span>
											<span class="meta-views">Views: 566,415</span>
											<span class="release-date">Dec 21, 2016</span>
										</div>
									</div>
								</div>
							</div>
							<div class="ui segment">
								<div class="ui grid">
									<div class="four wide column">
										<div class="ui avatar index-card-wr">
											<div class="index-card-text index-card-text2">
												<div>
													<div class="card-button">
														<button class="ui inverted button">
															<i class="play icon"></i>
															Preview course
														</button>
													</div>
												</div>
											</div>
											<img class="ui fluid rounded image" src="https://cdn.lynda.com/courses/518057-636178260135913862_270x480_thumb.jpg" style="height: 140px;" />
										</div>
									</div>
									<div class="twelve wide column">
										<h4 class="ui header noMa">Android 6.0 New Features for Developers</h4>
										<div style="margin-top: 5px;">Get started programming with Visual Basic using Visual Studio 2012 Experss for Windows Desktop.</div>
										<div style="margin-top: 5px;">
											<span class="meta-duration">4h 18m</span>
											<span class="meta-level">Beginner</span>
											<span class="meta-views">Views: 566,415</span>
											<span class="release-date">Dec 21, 2016</span>
										</div>
									</div>
								</div>
							</div>
							<div class="ui segment">

							</div>
						</div>
					</div>
				</div>


			</div>
		)
	}
}
