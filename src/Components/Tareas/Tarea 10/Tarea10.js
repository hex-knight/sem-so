import React, { Component } from 'react'
import './Tarea10.css'
import 'antd/dist/antd.css';

import Creador from './Creador';
import { Row, Spin } from 'antd';
import Procesador from './Procesador';
//Demo link: https://youtu.be/_F9Vr73z93M

const initialState = {
    dev: "",
    opA: null,
    opB: null,
    op: "",
    time: null,
    id: "",
}

export default class Tarea10 extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             procesos: [],
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
                    nuevos: this.state.nuevos,
                    totalTime: this.state.totalTime,
                    ids : this.state.ids,
                    quantum: this.state.quantum
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
