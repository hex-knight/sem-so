import { Card, Col, Descriptions, List, Row } from 'antd';
import React, { Component } from 'react'
import './Tarea1.css'
import 'antd/dist/antd.css';

export default class Procesador extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ...this.props.data,
            loteActual: null,
            procesoActual: null,
            lotesTerminados: [],
            contadorGlobal: 0,
            lotesPendientes: null,//Array.splice(0, 1) ==> Elimina el primer elemento de un array
            begin: false
        }
    }

    componentDidMount() {
        const loteActual = this.state.lotes[0];
        const procesoActual = this.state.lotes[0].procs[0]
        this.setState({ loteActual, procesoActual, begin: true });
        console.log("Lote Actual: ", loteActual)
        console.log("Proc.Actual: ", procesoActual)
    }

    renderLoteActual = () => {
        var loteActual = this.state.loteActual;
        return <Col xs={24} sm={12} md={12} lg={12} xl={12} >
        <Card hoverable title={`Lote Actual: ${loteActual.id}`}
            className="card" bordered={false}>
            <List size="small">{loteActual.procs.map((process, index) => {
                return <List.Item>
                    <Descriptions
                        size="small" 
                    >
                        <Descriptions.Item label="ID">{process.id}</Descriptions.Item>
                        <Descriptions.Item label="Tiempo">{process.time}</Descriptions.Item>
                    </Descriptions>
                </List.Item>
            })}
            </List>
        </Card>
        </Col>
    }


    render() {
        return (
                <Row className="row">
                {this.state.begin ?
                    this.renderLoteActual() :
                    null
                }
                {/* {this.state.begin ?
                    this.renderLoteActual() :
                    null
                }
                {this.state.begin ?
                    this.renderLoteActual() :
                    null
                }
                {this.state.begin ?
                    this.renderLoteActual() :
                    null
                } */}
                </Row>
        )
    }
}
