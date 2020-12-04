import { ShoppingCart, ShoppingCartOutlined } from '@material-ui/icons';
import { Button, Card, Col, Row } from 'antd';
import React, { Component } from 'react';
import './Tarea12.css'
import 'antd/dist/antd.css';

class BufferClass {
    constructor() {
        this.space = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.posCons = 0;
        this.posProd = 0;
    }

    produce = () => {
        this.space[this.posProd] = 1;
        this.posProd++;
        if (this.posProd === this.space.length)
            this.posProd = 0;
    }

    consume = () => {
        this.space[this.posCons] = 0;
        this.posCons++;
        if (this.posCons === this.space.length)
            this.posCons = 0;
    }

    reset = () => {
        this.space = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.posCons = this.posProd = 0;
    }
}

class Tarea12 extends Component {
    constructor(props) {
        super(props)

        this.state = {
            status: 0, //status off
            buffer: null,
            on: false
        }
    }

    componentDidMount() {
        const buffer = new BufferClass();
        this.setState({
            buffer
        })
        this.startProcess();
    }

    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    startProcess = () => {
        setInterval(() => {
            let status = this.state.status;
            let on = this.state.on;
            if (on) {
                // Si el status es de 0 : Pensando
                if (status === 0) {
                    // Obtener número random
                    let turn = this.getRandom(1, 10);
                    console.log(turn);
                    // Si es par, se asigna al status
                    if (turn % 2 === 0) {
                        status = turn;
                    } else {
                    // Si es impar, se asigna al status como negativo
                        status = turn * (-1);
                    }
                } else {  // Si no está pensando
                    if (status > 0) { // Si el status es positivo: Producir
                        if (this.canProduce()) { // Si puede producir
                            this.produce(); // Produce 1
                            status -= 1; // Resta 1 al status
                        } else { // Si no puede producir
                            // Devuelve el status a 0: Pensando
                            status = 0;
                        }
                    } 
                    else if (status < 0) {//Si el status es negativo: Consumir
                        if (this.canConsume()) {// Si puede consumir
                            this.consume();// Consume 1
                            status += 1;// Suma 1 al status
                        } else { // Si no puede consumir
                            // Devuelve el status a 0 : Pensando
                            status = 0;
                        }
                    }
                }
            }
            this.setState({ status })
        }, 250);// Tiempo de espera de cada iteración
    }

    consume = () => {
        let buffer = this.state.buffer;
        console.log("Consume");
        if (buffer !== null)
            buffer.consume();
        this.setState({
            buffer
        })
    }

    canProduce = () => {
        let buffer = this.state.buffer;
        if (buffer.space[buffer.posProd] === 1) {
            return false;
        }
        return true;
    }

    canConsume = () => {
        let buffer = this.state.buffer;
        if (buffer.space[buffer.posCons] === 0) {
            return false;
        }
        return true;
    }

    produce = () => {
        let buffer = this.state.buffer;
        console.log("Produce");
        if (buffer !== null)
            buffer.produce();
        this.setState({
            buffer
        })
    }

    logKey = (e) => {
        let on = this.state.on;
        switch (e.code) {
            case 'Escape':
                this.changeMode(on)
                break;
            default:
                break;
        }
    }

    resetBuffer = () => {
        let buffer = this.state.buffer;
        console.log("Reset");
        if (buffer !== null)
            buffer.reset();
        this.setState({
            buffer
        })
    }

    changeMode = (on) =>{
        this.setState({ on: !on, status: 0 })
        this.resetBuffer();
    }



    render() {
        let buffer = this.state.buffer;
        let status = this.state.status;
        let on = this.state.on;
        return (
            <div>
                 {
                    document.addEventListener("keydown", this.logKey)
                }
                <Row className="Row">
                    <Col xs={24} sm={24} md={1242} lg={24} xl={24} >
                        <Card
                        className="card" bordered={false}
                            hoverable
                            title={`Status :
                ${status === 0 ?
                                    "Pensando..." :
                                    status < 0 ?
                                        `Consumiendo ${status*(-1)}...` :
                                        `Produciendo ${status}...`
                                }`}
                            extra={
                                <Button onClick={() => this.changeMode(on)} >
                                    {
                                        on ?
                                            "Stop" : "Start"
                                    }
                                </Button>
                            }
                        >
                            <div className="queue">
                            {
                                buffer === null ?
                                    'Loading buffer...' :
                                    buffer.space.map((space) => {
                                        return (
                                            space === 0 ?
                                                <ShoppingCartOutlined /> :
                                                <ShoppingCart />
                                        )
                                    })
                            }
                            </div>
                        </Card>
                    </Col>
                </Row>
                {/* <Row className="row">
                <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                    <div>
                        {
                            buffer === null ?
                                'Loading buffer...' :
                                buffer.space.map((space) => {
                                    return ( 
                                        space === 0 ?
                                        <ShoppingCartOutlined /> :
                                            <ShoppingCart />
                                    )
                                })
                        }
                    </div>
                </Col>
            </Row> */}
            </div>
        )
    }
}

export default Tarea12;