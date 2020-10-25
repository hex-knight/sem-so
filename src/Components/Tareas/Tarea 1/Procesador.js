import { Badge, Card, Col, Descriptions, Divider, List, Progress, Result, Row, Spin, Statistic, Table } from 'antd';
import React, { PureComponent } from 'react'
import './Tarea1.css'
import 'antd/dist/antd.css';
import SettingsIcon from '@material-ui/icons/Settings';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ScheduleIcon from '@material-ui/icons/Schedule';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';




const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: 40
    },
    {
        title: 'L.',
        dataIndex: 'lote',
        width: 40
    },
    {
        title: 'Operación',
        dataIndex: 'op',
        width: 100
    },
    {
        title: 'Res',
        dataIndex: 'res',
    }
]


export default class Procesador extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            //...this.props.data,
            loteActual: null,
            procesoActual: null,
            progresoActual: 0,
            procesosTerminados: [],
            contadorGlobal: 0,
            lotesPendientes: this.props.data.lotes,
            begin: false,
            complete: false,
            loading: false,
        }
    }

    componentDidMount() {
        this.getProces();
        setTimeout(() => {
            this.startProcesses();
        }, 100);
    }

    async startProcesses(){
        
        setInterval(() => {
            var contadorGlobal = this.state.contadorGlobal
            if(this.state.procesoActual!==null){
                if(this.state.progresoActual===
                    this.state.procesoActual.time-1){
                    this.endProces();
                }
                else{
                    this.setState({
                        progresoActual:
                        this.state.progresoActual+0.5
                    })
                }
                this.setState({
                    contadorGlobal : contadorGlobal+0.5
                })
                if(this.state.complete){
                    clearInterval();
                }
            }
        }, 500);
    }

    wait = (ms, i) => {
        var d = new Date();
        var d2 = null;
        do {  d2 = new Date();}
        while (d2 - d < ms);
        return new Promise(i => 
            { return i+1}); 
    }



    getLote = () => {
        var auxLotes = this.state.lotesPendientes;
        if (auxLotes.length === 0 && this.state.loteActual) {
            console.log("Fuck");
            this.setState({
                lotesPendientes: auxLotes
            })
            if (this.state.loteActual.procs.length === 0) {
                this.setState({ loteActual: null })
            }
        } else {
            var newLote = auxLotes.splice(0, 1)[0];
            //console.log(newLote)
            this.setState({
                loteActual: newLote,
                lotesPendientes: auxLotes
            })
        }

    }

    getProces = async () => {
        var auxActual = this.state.loteActual;
        var lotesPendientes = this.state.lotesPendientes;
        var procesoActual = this.state.procesoActual;
        
        //var procesosTerminados = this.state.procesosTerminados;
        if (auxActual === null && lotesPendientes === null && auxActual === null) {
            this.setState({
                complete: true
            })
            return;
        }
        if (auxActual === null && lotesPendientes.length > 0) {
            this.getLote()
            setTimeout(() => {
                var auxActual = this.state.loteActual
                var newProc = auxActual.procs.splice(0, 1)[0];
                this.setState({
                    loteActual: auxActual,
                    procesoActual: newProc,
                })
            }, 100);
        }
        else if (auxActual === null && lotesPendientes.length === 0) {
            //procesosTerminados.push(this.getFinishedProcess(procesoActual));
            procesoActual = null;
            this.setState({
                procesoActual,
                
                complete: true
            })
        }
        else if (auxActual.procs.length === 0) {
            if (lotesPendientes.length === 0) {
                procesoActual = null;
                this.setState({
                    procesoActual,

                    loteActual: null
                })
                this.getLote();
            } else {
                this.getLote();
                setTimeout(() => {
                    var auxActual = this.state.loteActual
                    var newProc = auxActual.procs.splice(0, 1)[0];
                    this.setState({
                        loteActual: auxActual,
                        procesoActual: newProc,

                    })
                }, 100);
            }
        } else if (auxActual.procs.length > 0) {
            var newProc = auxActual.procs.splice(0, 1)[0];
            this.setState({
                loteActual: auxActual,
                procesoActual: newProc,

            })
            if (auxActual.procs.length === 0) {
                if (lotesPendientes.length > 0) {
                    this.getLote()
                }
                else if (lotesPendientes.length === 0) {
                    this.setState({ loteActual: null })
                }
            }

        }
        else {
            this.getLote()
        }

    }

    endProces = () => {
        var auxActual = this.state.procesoActual;
        if (auxActual) {
            this.setState({ loading: true,
            progresoActual: 0 })
            // if (auxActual === null) {
            //     this.getProces();
            // }
            var terminados = this.state.procesosTerminados;
            terminados.push(this.getFinishedProcess(auxActual));
            this.setState({
                procesosTerminados: terminados,
            })
            this.getProces();
            setTimeout(() => {
                this.setState({ loading: false })
            }, 500);
        }
        else {
            this.setState({ complete: true })
        }

    }





    renderLoteActual = () => {
        const loteActual = this.state.loteActual;
        const lotesPendientes = this.state.lotesPendientes;
        const lotes = loteActual !== null && lotesPendientes.length > 0;
        return <Col xs={24} sm={24} md={24} lg={12} xl={12} >
            { loteActual?
            <Card hoverable title={
                loteActual !== null ?
                    `Lote Actual: ${loteActual.id}` :
                    `Lotes Finalizados`
            }
                className="card" bordered={false}
                extra={
                    <Badge count={
                        lotes !== null ?
                            <Spin size="small" /> :
                            null}>
                        <AllInboxIcon />
                    </Badge>
                }
            >
                <List >
                        {loteActual.procs.map((process, index) => {
                            return <Row className="info">
                                 <Col xs={12} sm={12} md={12} lg={12} xl={12} >
                                     <List.Item>
                                     ID: {process.id}
                                     </List.Item>
                                 </Col>
                                  <Col xs={12} sm={12} md={12} lg={12} xl={12} >
                                      <List.Item>
                                      Tiempo: {process.time}
                                      </List.Item>
                                  </Col>
                            </Row>
                        })}
                </List>
            </Card>:
            <Result status="success"
            title="Lotes Finalizados"
            />    
            }
        </Col>
    }

    renderOp = (op, type) => {
        switch (op.op) {
            case "1":
                return type === 1 ? `${op.a} + ${op.b}` : op.a + op.b;
            case "2":
                return type === 1 ? `${op.a} - ${op.b}` : op.a - op.b;
            case "3":
                return type === 1 ? `${op.a} / ${op.b}` : op.a / op.b;
            case "4":
                return type === 1 ? `${op.a} * ${op.b}` : op.a * op.b;
            case "5":
                return type === 1 ? `${op.a} % ${op.b}` : op.a % op.b;
            case "6":
                return type === 1 ? `${op.a} ^ ${op.b}` : op.a ^ op.b;
            default:
                return type === 1 ? '?' : 0;
        }
    }

    getFinishedProcess = input => {
        var output = {
            id: input.id,
            lote: input.lote,
            op: this.renderOp(input.proc, 1),
            res: this.renderOp(input.proc, 2)
        }
        return output;
    }

    renderProcesoActual = () => {
        var procesoActual = this.state.procesoActual;
        var tiempoTranscurrido = Math.ceil(this.state.progresoActual)
        var tiempoRestante = procesoActual !== null ? 
        Math.ceil(procesoActual.time-this.state.progresoActual)
        : 0;
        return <Col xs={24} sm={24} md={24} lg={12} xl={12} >{
            procesoActual?
            <Card hoverable title={procesoActual !== null ?
                `Proceso Actual: ${procesoActual.id}` :
                `Procesos Finalizados`
            }
                className="card" bordered={false}
                extra={
                    <Badge
                        count={
                            procesoActual !== null ?
                                <Spin size="small" /> : null
                        }>
                        <SettingsIcon />
                    </Badge>
                }
            >
                <Row className="process">
                    <Col xs={16} sm={16} md={16} lg={12} xl={12} >
                        <Progress type="circle"
                            className={procesoActual !== null ?
                                "process-done" :
                                "process-done"
                            }
                            percent={
                                procesoActual !== null ?
                                Math.ceil(
                                    (this.state.progresoActual*100)/
                                    procesoActual.time) :
                                    100
                            } />
                    </Col>
                    {procesoActual !== null ?
                        <Col xs={8} sm={8} md={8} lg={12} xl={12}
                        className="info" >
                            <Descriptions size="small" >
                                <Descriptions.Item label="Dev">{procesoActual.dev}</Descriptions.Item>
                            </Descriptions>
                            <Descriptions size="small" >
                                <Descriptions.Item label="Op">
                                    {this.renderOp(procesoActual.proc, 1)}
                                </Descriptions.Item>
                            </Descriptions>
                        </Col> :
                        null}

                </Row>{procesoActual !== null ?
                    <Row className="process info" >
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} >
                            <Descriptions size="small" >
                                <Descriptions.Item label="T.Trans">{tiempoTranscurrido}</Descriptions.Item>
                            </Descriptions>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} >
                            <Descriptions size="small">
                                <Descriptions.Item label="T.Rest">{tiempoRestante}</Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row> : null}
            </Card>:
            <Result status="success"
            title="Procesos Finalizados"
            subTitle={`Terminado en ${this.state.contadorGlobal} segundos`}
            />
            }
        </Col>
    }

    renderTerminados = () => {
        var terminados = [];
        terminados = this.state.procesosTerminados;
        return <Col xs={24} sm={24} md={24} lg={12} xl={12} >
            <Card hoverable title={`Procesos Terminados: ${terminados.length}`}
                className="card" bordered={false}
                extra={
                    <Badge count={terminados.length}>
                        <CheckCircleOutlineIcon />
                    </Badge>
                }
            >
                <Table columns={columns} pagination={false} bordered
                    size="small" onChange={() => { }}
                    loading={this.state.loading}
                    dataSource={this.state.loading ? [] :
                        terminados
                    } scroll={{ y: 150 }}

                />
            </Card>
        </Col>
    }

    renderMonitor = () => {
        var lotesPendientes = this.state.lotesPendientes.length
        var procesoActual = this.state.procesoActual !== null ?
            this.state.procesoActual.id : 0;
        var procesosTerminados = this.state.procesosTerminados.length;
        var global = this.state.contadorGlobal;
        return <Col xs={24} sm={24} md={24} lg={12} xl={12} >
            <Card hoverable title="Monitor"
                className="monitor-card" bordered={false}
                extra={<DesktopMacIcon />}
            >
                <List size="small">
                    <List.Item>
                        <Row className="monitor-row">
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}
                                className="monitor-col">
                                <Statistic title="L. Pendientes"
                                    value={lotesPendientes}
                                    className="monitor-stat"
                                    prefix={<AllInboxIcon />} />
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}
                            >
                                <Statistic title="Contador Global"
                                    value={Math.ceil(global)}
                                    className="monitor-stat"
                                    prefix={<ScheduleIcon />} />
                            </Col>
                            <Divider />
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}
                            >
                                <Statistic title="P. Terminados"
                                    value={procesosTerminados}
                                    className="monitor-stat"
                                    prefix={<CheckCircleOutlineIcon />} />
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}
                            >
                                <Statistic title="P. Actual"
                                    value={procesoActual}
                                    className="monitor-stat"
                                    prefix={<SettingsIcon />} />
                            </Col>
                        </Row>
                    </List.Item>
                </List>
            </Card>
        </Col>
    }


    render() {
        return (
                <Row className="row">
                    {this.state.loteActual ||
                        this.state.procesosTerminados.length > 0 ? (
                            this.renderLoteActual()
                        ) :
                        null
                    }
                    {this.state.procesoActual ||
                        this.state.procesosTerminados.length > 0 ? (
                            this.renderProcesoActual()
                        ) :
                        null
                    }
                    {
                        this.renderTerminados()
                    }
                    {
                        this.renderMonitor()
                    }
                </Row>
        )
    }
}
