import { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
//import { Button } from 'react-bootstrap';
import { Col, Container, Row } from 'react-bootstrap'
import Navbar from './components/Navbar/Navbar'
import Home from './components/Home/Home'
import './App.css';
import LoginPage from './components/autherisation/LoginPage';
import RegisterPage from './components/autherisation/RegisterPage';
import TweetWithReplys from './components/Tweet/TweetWithReplys';
import Profile from './components/Profile/Profile';
import Follow from './components/Profile/Follow';
import Search from './components/Search/Search';
import Messages from './components/messages/Messages';
import Chat from './components/messages/Chat';
import NotificationsPage from './components/Notifications/NotificationsPage';

class App extends Component {
  constructor() {
    super();
    this.user = window.sessionStorage.getItem("user")
    //user = JSON.stringify(user)
    this.user = JSON.parse(this.user)
  }
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={LoginPage} exact/>
          <Route path="/signup" component={RegisterPage} exact/>
          <Container fluid style={{minHeight:"100vh",paddingTop:"10px"}}>
              <Row className="h-100" style={{minHeight:"100vh",paddingTop:"10px"}}>
                  <Col xs={2} style={{minHeight:"100vh",paddingTop:"10px"}}>
                      <Navbar/>
                  </Col>
                  <Col xs={10} md={8} lg={6} style={{minHeight:"100vh",paddingTop:"10px"}} className="home-main-container">
                    <Route path="/" component={Home} exact/>
                    <Route path="/tweet/:id" component={TweetWithReplys} exact/>
                    <Route path="/profile/:id" component={Profile} exact/>
                    <Route path="/messages/chat/:chatid" component={Chat} exact/>
                    <Route path="/messages" component={Messages} exact/>
                    <Route path="/search" component={Search} exact/>
                    <Route path="/notifications" component={NotificationsPage} exact/>
                    <Route path="/profile/:id/followinfo" component={Follow} exact/>
                  </Col>
                  {<Col className="d-none d-md-block" style={{minHeight:"100vh",paddingTop:"10px"}} md={2} lg={4}>
                      News
                      <h3>
                          {this.user?this.user.username:null}
                      </h3>
                  </Col>}
              </Row>
          </Container>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
