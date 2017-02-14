import Inferno from 'inferno'
import { Route } from 'inferno-router'

import Home from './pages/home';
import Layout from './tags/layout';
import Article from './pages/article';
import Error404 from './pages/errors/404';
import Credit from './pages/credit';
import Course from './pages/course';
import Video from './pages/course';
import Layout3 from './pages/layout3';
import Category from './pages/category';
import Software from './pages/software';

export default (
	<Route component={ Layout }>
		<Route path="/" component={ Home } />
		<Route path="/course/:courseId" component={ Course } />
		<Route path="/course/:courseId/:videoId" component={ Video } />
		<Route path="/category/:cateID" component={ Category } />
		<Route path="/software/:softID" component={ Software } />
		<Route path="/layout3" component={ Layout3 } />
		<Route path="/blog/:title" component={ Article } />
		<Route path="*" component={ Error404 } />
	</Route>
);
