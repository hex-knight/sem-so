import React, { Component } from 'react'
import './Tarea4.css'
import 'antd/dist/antd.css';
import { Button, Col, Row, InputNumber } from 'antd';

export default class Creador extends Component {
    constructor(props) {
        super(props)

        this.state = {
            lotes: [],
            ids: [],
            totalTime: null,
            status: "working",
            creating: false,
            newProcesses: 1,
            ...this.props.initialState
        }
        this.startProcess = this.startProcess.bind(this)
    }

    clean = () => {
        this.setState({
            ...this.props.initialState
        })
    }

    valid = (process) => {
        return  !this.state.ids.includes(process.id) && !(
            (process.opB === 0 && process.op === 3)&&
            (process.opB === 0 && process.op === 5)
            );
    }

    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }


    saveData = () => {
        var i=0;
        let process;
        while(i< this.state.newProcesses){
            process = {
                id: this.getRandom(1,100),
                proc: {
                    op:  this.getRandom(1,6),
                    a:  Math.floor(Math.random()*10),
                    b:  Math.floor(Math.random()*10)
                },
                time: this.getRandom(7,17),
                lote: Math.floor(this.state.ids.length/4)
            }
            //console.log(process);
        if (this.valid(process)) {
            console.log(process)
            this.saveProcess(process);
            i++;
        } 
    }
    this.startProcess();
    }



    saveProcess = process => {
        var lotes = this.state.lotes;
        var ids = this.state.ids
        var totalTime = this.state.totalTime;
        var lote;
        var id = 0;
        if (lotes.length > 0) {
            while (lotes[id].procs.length >= 4) {
                id++;
                if (id >= lotes.length) break;
            }
            if (id < lotes.length) {
                console.log(process)
                totalTime += process.time;
                lotes[id].procs.push({
                    ...process
                })
            } else {
                lote = {
                    id: id,
                    procs: []
                }
                totalTime += process.time;
                lotes.push({
                    id:id,
                    procs:[process]
                })
            }
            ids.push(process.id)
        } else {
            lote = {
                id: id,
                procs: []
            }
            lote.procs.push(process)
            totalTime += process.time;
            lotes.push(lote)
            ids.push(process.id)
        }
        this.setState({ lotes, ids, totalTime, creating:false })
    }

    startProcess = () => {
        const response = {
            ...this.state,
        }
        this.props.setProcesses(response);
    }



    render() {
        return (
            <div className="editor">
                <Row className="row-editor">
                <Col xs={8} md={12} lg={6} xl={6}
                        className="input">
                        <InputNumber className="entry"
                            placeholder="Número de procesos a crear: "
                            min={1}
                            onChange={e => {
                                this.setState({
                                    newProcesses: e
                                })
                            }}
                            value={this.state.newProcesses}
                        />
                    </Col>
                    <Col xs={8} md={12} lg={6} xl={6}
                        className="input">
                        <Button onClick={() => this.saveData()} >
                            Crear procesos
                        </Button>
                    </Col>
                </Row>
            </div>
        )
    }
}
