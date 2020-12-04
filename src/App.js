import React, { Component } from 'react';
import './App.css';
//import Tarea1 from './Components/Tareas/Tarea1';
import 'antd/dist/antd.css';
import ModalInfo from './Components/Commons/ModalInfo/ModalInfo';
import TopBar from './Components/Commons/TopBar/TopBar';
import Router from './Components/Commons/Router/Router';



class App extends Component{
  constructor(props) {
    super(props)
  
    this.state = {
       visible: false
    }
  }

  closeModal = () =>{
    this.setState({visible:false})
  }

  openModal = () =>{
    this.setState({visible:true})
  }

  changePage = (pageNo) =>{
    window.location=`/${pageNo}`
  }
  

  render(){
    return (
    <div className="App">
      <ModalInfo 
      changePage={this.changePage}
      visible={this.state.visible} closeModal={this.closeModal} />
      <TopBar  openModal={this.openModal} changePage={this.changePage} />
      <Router />
    </div>
  );}
}

export default App;
