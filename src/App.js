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
       currPage:'',
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
    switch (pageNo) {
      case 2:
        window.location="/2"
        console.log(2);
        break;
      case 4:
        window.location="/4"
        console.log(4);
        break;
      default:
        break;
    }
  }
  

  render(){
    const pageNo= window.location!=='/'?window.location.pathname[1]:'1';
    return (
    <div className="App">
      <ModalInfo 
      changePage={this.changePage}
      visible={this.state.visible} closeModal={this.closeModal} />
      <TopBar currPage={pageNo} openModal={this.openModal} changePage={this.changePage} />
      {/* <Tarea1 /> */}
      <Router />
    </div>
  );}
}

export default App;
