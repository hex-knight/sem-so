import React, { Component } from 'react'
import './Tarea10.css'
import 'antd/dist/antd.css';
import { Button, Col, Row, InputNumber } from 'antd';


export default class Creador extends Component {
    constructor(props) {
        super(props)

        this.state = {
            nuevos: [],
            ids: [],
            totalTime: null,
            status: "working",
            creating: false,
            newProcesses: 1,
            quantum : 3,
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
        return  !( this.state.ids.includes(process.id) ||
            ((process.proc.b === 0 && process.proc.op === 3) ||
            (process.proc.b === 0 && process.proc.op === 5))
            );
    }

    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }


    saveData = () => {
        var i=0;
        let process;
        const abc = "abcdefghijklmnopqrstuvwxyz"
        while(i< this.state.newProcesses){
            process = {
                id: abc[this.getRandom(1,26)]+
                    abc[this.getRandom(1,26)]+
                    this.getRandom(1,100),
                proc: {
                    op:  this.getRandom(1,6),
                    a:  Math.floor(Math.random()*10),
                    b:  Math.floor(Math.random()*10)
                },
                time: this.getRandom(7,17),
                blocked: 0,
                tiempoLlegada: 0,
                ttrans: 0,
                tiempoRespuesta: null,
                ttot: 0
            }
            process.ttot = process.time;
            //console.log(process);
        if (this.valid(process) === true) {
            console.log("Valid: ",process)
            this.saveProcess(process);
            i++;
        } else{
            console.log("Invalid: ",process)
        }
    }
    this.startProcess();
    }



    saveProcess = process => {
        var nuevos = this.state.nuevos;
        var ids = this.state.ids
        var totalTime = this.state.totalTime;
            totalTime += process.time;
            nuevos.push(process)
            ids.push(process.id)
        this.setState({ nuevos, ids, totalTime, creating:false })
    }

    startProcess = () => {
        const response = {
            status : this.state.status,
            nuevos : this.state.nuevos,
            ids    : this.state.ids,
            quantum : this.state.quantum
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
                            placeholder="Número de nuevos a crear: "
                            min={1}
                            onChange={e => {
                                this.setState({
                                    newProcesses: e
                                })
                            }}
                            value={this.state.newProcesses}
                        />
                        <InputNumber className="entry"
                            placeholder="Quantum: "
                            min={3}
                            max={7}
                            onChange={e => {
                                this.setState({
                                    quantum: e
                                })
                            }}
                            value={this.state.quantum}
                        />
                    </Col>
                    <Col xs={8} md={12} lg={6} xl={6}
                        className="input">
                        <Button onClick={() => this.saveData()} >
                            Crear nuevos
                        </Button>
                    </Col>
                </Row>
            </div>
        )
    }
}
