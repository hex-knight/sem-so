import React, { Component } from 'react'
import './Tarea4.css'
import 'antd/dist/antd.css';

import Creador from './Creador';
import { Row, Spin } from 'antd';
import Procesador from './Procesador';
//import { sampleLotes } from './Data';




const initialState = {
    dev: "",
    opA: null,
    opB: null,
    op: "",
    time: null,
    id: "",
}

//const dataSource = sampleLotes;

export default class Tarea4 extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             lotes: [],
             ids: [],
             totalTime: null,
             status: "adding"
        }
    }
    
    setProcesses= response =>{
        this.setState({status:"loading"})
        console.log(response);
        setTimeout(() => {
            this.setState({
            ...response
        })
        }, 1500);
    }

    restart = () =>{
        // this.setState({status:"loading",
        // ids:[],
        // lotes:[]})
        // setTimeout(() => {
        //     this.setState({
        //     status:"adding",
        // })
        // }, 1500);
    }

    renderWorkflow = status =>{
        switch (status) {
            case "adding":
                return <Creador initialState={initialState} setProcesses={this.setProcesses} />
            case "loading":
                return <Row className="row">
                    <Spin size="large" />
                </Row>
            case "working":
                return <Procesador 
                data={{
                    lotes: this.state.lotes,
                    totalTime: this.state.totalTime
                }}/>
            default:
                break;
        }
    }

    render() {
        const status = this.state.status;
        return (
            <div className="body">
                {this.renderWorkflow(status)}
            </div>
        )
    }
}
