import React, { Component } from 'react'
import './Tarea1.css'
import 'antd/dist/antd.css';
import { Button, Col, Input, Row, InputNumber, Select, Tooltip, Badge, Divider, Spin } from 'antd';
import { Option } from 'antd/lib/mentions';
import SettingsIcon from '@material-ui/icons/Settings';
import AllInboxIcon from '@material-ui/icons/AllInbox';




const initialState = {
    dev: "",
    opA: null,
    opB: null,
    op: "",
    time: null,
    id: "",
}

export default class Tarea1 extends Component {
    constructor(props) {
        super(props)

        this.state = {
            lotes: [],
            ids: [],
            status: "adding",
            ...initialState
        }
    }

    clean = () => {
        this.setState({
            ...initialState
        })
    }

    valid = () => {
        return this.state.id !== "" && this.state.dev !== "" &&
            this.state.time !== null && this.state.opA !== null &&
            this.state.opB !== null && this.state.op !== "" &&
            !this.state.ids.includes(this.state.id);
    }

    saveData = () => {
        if (this.valid()) {
            console.log("Success")
            const process = {
                id: this.state.id,
                dev: this.state.dev,
                proc: {
                    op: this.state.op,
                    a: this.state.opA,
                    b: this.state.opB
                },
                time: this.state.time
            }
            this.saveProcess(process);
            this.clean();
        } else {
            console.log("Fail")
            return;
        }
    }



    saveProcess = process => {
        var items = this.state.lotes;
        var ids = this.state.ids
        var lote;
        var id = 0;
        if (items.length > 0) {
            while (items[id].procs.length >= 4) {
                id++;
                if (id >= items.length) break;
            }
            if (id < items.length) {
                items[id].procs.push({
                    process
                })
            } else {
                lote = {
                    id: id,
                    procs: [
                        process
                    ]
                }
                items.push(lote)
            }
            ids.push(process.id)
        } else {
            lote = {
                id: id,
                procs: [
                    process
                ]
            }
            items.push(lote)
            ids.push(process.id)
        }
        this.setState({ lotes: items, ids })
    }

    startProcess = () => {
        this.setState({ status: "loading" })
        setTimeout(() => {
            this.setState({ status: "proccessing" })
        }, 1500);
    }



    render() {
        return (
            <div className="body">
                {this.state.status === "adding" ?
                    <div>
                        <Row className="row">
                            <Col xs={6} md={4} lg={4} xl={4}
                                className="input">
                                ID del Proceso
                    </Col>
                            <Col xs={18} md={20} lg={20} xl={20}
                                className="input">
                                Nombre del Programador
                    </Col>
                            <Col xs={6} md={4} lg={4} xl={4}
                                className="input">
                                <Tooltip title="El ID ya existe"
                                    visible={this.state.ids.includes(this.state.id)}
                                >
                                    <Input className="entry"
                                        onPressEnter={() => this.saveData}
                                        autoFocus={true}
                                        placeholder="ID..."
                                        onChange={e => {
                                            this.setState({
                                                id: e.target.value
                                            })
                                        }}
                                        value={this.state.id}
                                    />
                                </Tooltip>
                            </Col>
                            <Col xs={18} md={20} lg={20} xl={20}
                                className="input">
                                <Input className="entry"
                                    placeholder="Programador..."
                                    onChange={e => {
                                        this.setState({
                                            dev: e.target.value
                                        })
                                    }}
                                    value={this.state.dev}
                                />
                            </Col>
                        </Row>
                        <Row className="row">
                            <Col xs={8} md={12} lg={6} xl={6}
                                className="input">
                                Tiempo Estimado
                    </Col>
                            <Col xs={16} md={12} lg={18} xl={18}
                                className="input">
                                Operación:  A ( Operando ) B
                    </Col>
                            <Col xs={8} md={12} lg={6} xl={6}
                                className="input">
                                <InputNumber className="entry"
                                    placeholder="Tiempo max. Estimado..."
                                    min={0}
                                    onChange={e => {
                                        this.setState({
                                            time: e
                                        })
                                    }}
                                    value={this.state.time}
                                />
                            </Col>
                            <Col xs={6} md={4} lg={6} xl={6}
                                className="input">
                                <InputNumber className="number"
                                    placeholder="A"

                                    onChange={e => {
                                        this.setState({
                                            opA: e
                                        })
                                    }}
                                    value={this.state.opA}
                                />

                            </Col>
                            <Col xs={4} md={4} lg={6} xl={6}
                                className="input">
                                <Select
                                    onChange={value => {
                                        this.setState({
                                            op: value
                                        })
                                    }}
                                    value={this.state.op}
                                >
                                    <Option value="1">+</Option>
                                    <Option value="2">-</Option>
                                    <Option value="3">/</Option>
                                    <Option value="4">*</Option>
                                    <Option value="5">%</Option>
                                    <Option value="6">^</Option>
                                </Select>
                            </Col>
                            <Col xs={6} md={4} lg={6} xl={6}
                                className="input">
                                <InputNumber className="number"
                                    placeholder="B"
                                    onChange={e => {
                                        this.setState({
                                            opB: e
                                        })
                                    }}
                                    value={this.state.opB}
                                />

                            </Col>
                        </Row>
                        <Divider />
                        <Row className="row">
                            <Col xs={24} md={12} lg={12} xl={12} >
                                <Button
                                    type="secondary"
                                    disabled={!this.valid()}
                                    onClick={() => this.saveData()}
                                >
                                    Agregar Proceso
                        </Button>
                            </Col>{this.state.ids.length > 0 ? <>
                                <Col xs={10} md={2} lg={2} xl={2} >
                                    <div className="counter">
                                        <Badge count={this.state.ids.length}>
                                            <SettingsIcon />
                                        </Badge>
                                    </div>
                                </Col>
                                <Col xs={2} md={1} lg={1} xl={1} >
                                    <Divider type="vertical" />
                                </Col>
                                <Col xs={10} md={2} lg={2} xl={2} >
                                    <div className="counter">
                                        <Badge count={this.state.lotes.length}>
                                            <AllInboxIcon />
                                        </Badge>
                                    </div>
                                </Col>
                                <Col xs={24} md={7} lg={7} xl={7} >
                                    <Button
                                        type="primary"
                                        onClick={() => this.startProcess()}
                                    >
                                        Iniciar
                        </Button>
                                </Col>
                            </>
                                : null}
                        </Row>
                    </div> : <div>
                        <Spin size="large"
                            spinning={this.state.status === "loading"}>
                                {this.state.status==="proccessing"?
                                "procesando":null}
                        </Spin>
                    </div>}
            </div>
        )
    }
}
