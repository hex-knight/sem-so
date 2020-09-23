import React, { Component } from 'react'
import './Tarea1.css'
import 'antd/dist/antd.css';

import Creador from './Creador';
import { Spin } from 'antd';
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

// const dataSource = sampleLotes;
// const timeSource = 15;

export default class Tarea1 extends Component {
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
                return <Spin size="large" />
            case "working":
                return <Procesador data={{
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
