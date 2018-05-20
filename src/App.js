import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai'; //Moved to BackEnd
import Navigation from './components/Navigation/navigation';
import Signin from './components/signin/signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/face';
import Logo from './components/Logo/logo';
import ImageLinkForm from './components/ImageLinkForm/imagelinkform';
import Demographics from './components/Demographics/demo';
import Rank from './components/Rank/rank';
import './App.css';

// MOVED TO BACKEND for Security Reasons
const app = new Clarifai.App({
  apiKey: 'b79c7223ba4940b583ddce4661445a7f'
 });


const particlesOpt = {
  particles: {
    number: {
      value: 99,
      density: {
        enable: true,
        value_area: 800,
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  age: '',
  gender: '',
  culture: '',
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    count: 0,
    joined: ''
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    //this.onInputChange = this.onInputChange.bind();
  }

  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        count: data.count,
        joined: data.joined
    }})
  }

  //basic server test API call in console
  /*
    componentDidMount() {
      fetch('http://localhost:3001/')
      .then(response => response.json())
      .then(console.log)
    }
  */

  calculateFaceLocation = (data) => {
    const location = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height= Number(image.height);
    return {
      leftCol: location.left_col * width,
      topRow: location.top_row * height,
      rightCol: width - (location.right_col * width),
      bottomRow: height - (location.bottom_row * height),
    }
    //console.log(height, width);
  }
displayFaceBox = (box) =>{
  console.log(box);
  this.setState({box: box})
} 

  renderAge = (data) => {
    const age = data.outputs[0].data.regions[0].data.face.age_appearance.concepts[0].name;
    this.setState({age: age});
  }
  
  renderGender = (data) => {
    const gender = data.outputs[0].data.regions[0].data.face.gender_appearance.concepts[0].name;
    this.setState({gender: gender});
  }
  renderRace = (data) => {
    const race = data.outputs[0].data.regions[0].data.face.multicultural_appearance.concepts[0].name;
    this.setState({culture: race});
  }

  onInputChange = (e) => {
   this.setState({input: e.target.value})
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input});
    //Move to BackEnd but then Blue box not working
    app.models
      .predict(Clarifai.DEMOGRAPHICS_MODEL, this.state.input)
 
/*       fetch('http://localhost:3001/imageurl', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.user.input,
          })
        })
        .then(response => response.json())
*/   
        .then(response => {
        if (response) {
          fetch('https://thawing-cliffs-74968.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id,
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {count: count})
             //this will update the whole user Object { user: { count: count } }
            )
          })
          .catch(err => console.log(err))
        }
        this.displayFaceBox(this.calculateFaceLocation(response)) /*.renderAge(response).renderGender(response).renderRace(response)*/
      })
          .catch (error => console.log(error));
        //console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        //console.log(response.outputs[0].data.regions[0].data.face.age_appearance.concepts[0].name);
        //console.log(response.outputs[0].data.regions[0].data.face.gender_appearance.concepts[0].name);
        //console.log(response.outputs[0].data.regions[0].data.face.multicultural_appearance.concepts[0].name);
      

    app.models
      .predict(Clarifai.DEMOGRAPHICS_MODEL, this.state.input)
      .then(response =>
          this.renderAge(response)/*.renderGender(response).renderRace(response)*/
       .catch (error => console.log(error))
      );
    app.models
      .predict(Clarifai.DEMOGRAPHICS_MODEL, this.state.input)
      .then(response =>
          this.renderGender(response)/*.renderRace(response)*/
       .catch (error => console.log(error))
      );
    app.models
      .predict(Clarifai.DEMOGRAPHICS_MODEL, this.state.input)
      .then(response =>
          this.renderRace(response)
       .catch (error => console.log(error))
      );
  }
  onRouteChange = (newRoute) => {
    if (newRoute === 'signout') {
      this.setState(initialState) //So it clears the state when signing out      {isSignedIn: false}
    }
    else if (newRoute === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: newRoute})
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOpt}/>
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} />
        {this.state.route === 'home' 
          ?<div>
              <Logo/>
              <Rank name={this.state.user.name} count={this.state.user.count} />
              <Demographics age={this.state.age} gender={this.state.gender} culture={this.state.culture} />
              <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
            </div>
          : (this.state.route === 'signin'
            ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            ) 
        } 
      </div>
    );
  }
}

export default App;
