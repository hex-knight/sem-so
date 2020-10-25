import { Badge, Card, Col, Descriptions, Divider, List, Progress, Result, Row, Spin, Statistic, Table } from 'antd';
import React, { PureComponent } from 'react'
import './Tarea6.css'
import 'antd/dist/antd.css';
import SettingsIcon from '@material-ui/icons/Settings';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ScheduleIcon from '@material-ui/icons/Schedule';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';

const columnsBlocked = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: 50
    },
    {
        title: 'Aviable in',
        dataIndex: 'blocked',
    }
]

const columnsNuevos = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: 50
    },
    {
        title: 'Time',
        dataIndex: 'time',
    }
]

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: 50
    },
    {
        title: 'Operación',
        dataIndex: 'op',
        width: 90
    },
    {
        title: 'Res',
        dataIndex: 'res',
    }
]

const columnFinals = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: 20
    },
    {
        title: 'Op',
        dataIndex: 'op',
        width: 45
    },
    {
        title: 'Res',
        dataIndex: 'res',
        width: 30,
    },
    {
        title: 'Time',
        dataIndex: 'time',
        width: 30,
    },
    {
        title: 'Llegada',
        dataIndex: 'tiempoLlegada',
        width: 30,
    },
    {
        title: 'T. Fin.',
        dataIndex: 'tiempoFin',
        width: 30,
    },
    {
        title: 'T. Esp.',
        dataIndex: 'tiempoEspera',
        width: 30,
    },
    {
        title: 'Retorno',
        dataIndex: 'tiempoRetorno',
        width: 30,
    },
    {
        title: 'Respuesta',
        dataIndex: 'tiempoRespuesta',
        width: 30,
    },
    {
        title: 'Servicio',
        dataIndex: 'ttrans',
        width: 30,
    },
]


export default class Procesador extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            //...this.props.data,
            listos: [],
            procesoActual: null,
            progresoActual: 0,
            procesosTerminados: [],
            procesosBloqueados: [],
            contadorGlobal: 0,
            nuevos: this.props.data.nuevos,
            begin: false,
            complete: false,
            loading: false,
            pause: false,
            memory: 0
        }
    }

    componentDidMount() {
        this.getProces();
        setTimeout(() => {
            this.checkMemory();
            this.startProcesses();
        }, 100);
    }

    async startProcesses() {
        var timeUnit = 1;
        setInterval(() => {
            var listos = this.state.listos
            if (this.state.pause === false) {
                var contadorGlobal = this.state.contadorGlobal;
                var procesoActual = this.state.procesoActual;
                if (procesoActual !== null) {
                    if(this.state.progresoActual <
                        procesoActual.time) {
                        procesoActual.ttrans += timeUnit;
                        this.setState({
                            progresoActual:
                                this.state.progresoActual + timeUnit,
                            procesoActual
                        })
                    }
                    if (this.state.progresoActual ===
                        procesoActual.time) {
                        this.endProces();
                    }
                } else {
                    if (this.state.complete) {
                        clearInterval();
                        return;
                    }
                    if (listos) {
                        if (listos.length > 0) {
                            this.getProces();
                        }
                    }
                }
                this.setState({
                    contadorGlobal: contadorGlobal + timeUnit
                })
                this.checkBlocked();
            }
        }, timeUnit * 500);
    }

    checkMemory = () => {
        var nuevos = this.state.nuevos;
        var listos = this.state.listos;
        var procesoActual = this.state.procesoActual;
        var bloqueados = this.state.bloqueados;
        var avMemory = 4;
        this.setState({ loading: true })
        if (bloqueados) {
            if (bloqueados.length > 0)
                avMemory -= bloqueados.length;
        }
        if (procesoActual) {
            avMemory -= 1;
        }
        while (avMemory > 0 && nuevos.length > 0) {
            var nuevo = nuevos.splice(0, 1)[0];
            nuevo.tiempoLlegada = this.state.contadorGlobal;
            listos.push(nuevo);
            avMemory--;
        }
        if (!procesoActual && listos.length > 0) {
            var pNuevo = listos.splice(0, 1)[0];
            pNuevo.tiempoLlegada = this.state.contadorGlobal;
            procesoActual = pNuevo;
        }
        setTimeout(() => {
            this.setState({
                nuevos, listos, procesoActual, loading: false
            })
        }, 100);
    }

    checkBlocked = () => {
        var procesosBloqueados = this.state.procesosBloqueados;
        var listos = this.state.listos;
        var current = this.state.contadorGlobal;
        if (procesosBloqueados) {
            if (procesosBloqueados.length > 0) {
                for (var i = 0; i < procesosBloqueados.length; i++) {
                    procesosBloqueados[i].blocked -= current % 1 === 0? 1 : 0
                }
                if (procesosBloqueados[0].blocked < 0) {
                    this.setState({ loading: true })
                    var restored = procesosBloqueados.splice(0, 1)[0];
                    console.log(restored)
                    listos.push(restored);
                    this.setState({ procesosBloqueados, listos, loading: false })
                    return;
                }
                this.setState({ procesosBloqueados })
            }
        }
    }

    logKey = (e) => {
        switch (e.code) {
            case 'KeyP':
                this.setState({ pause: true })
                break;
            case 'KeyC':
                this.setState({ pause: false })
                break;
            case 'KeyE':
                if (this.state.pause === false) {
                    this.stopProcess();
                }
                break;
            case 'KeyW':
                if (this.state.pause === false) {
                    this.failProcess();
                }
                break;
            default:
                break;
        }
    }

    getProces = async () => {
        var avMemory = 4;
        var procesoActual = null;
        var listos = this.state.listos;
        var bloqueados = this.state.procesosBloqueados;
        if (bloqueados) {
            avMemory -= bloqueados.length;
        }
        if (listos && avMemory > 0) {
            if (listos.length > 0) {
                procesoActual = listos.splice(0, 1)[0];
                if(procesoActual.tiempoRespuesta === -1){
                    procesoActual.tiempoRespuesta = 
                    this.state.contadorGlobal -
                        procesoActual.tiempoLlegada;
                    if(procesoActual.tiempoRespuesta < 0){
                        procesoActual.tiempoRespuesta = 0;
                    }
                }
                this.setState({ procesoActual, listos })
            }
        } else {
            this.setState({ procesoActual });
        }
    }

    feedNew = () => {
        var avMemory = 4;
        var procesosBloqueados = this.state.procesosBloqueados;
        var listos = this.state.listos;
        var procesoActual = this.state.procesoActual;
        var nuevos = this.state.nuevos;
        this.setState({ loading: true })
        if (procesosBloqueados) {
            avMemory -= procesosBloqueados.length;
        }
        if (procesoActual) {
            avMemory -= 1;
        }
        if (avMemory > 0) {
            if (nuevos) {
                while (listos.length < avMemory && nuevos.length > 0) {
                    var nuevo = nuevos.splice(0, 1)[0];
                    nuevo.tiempoLlegada = this.state.contadorGlobal;
                    listos.push(nuevo);
                }
                this.setState({ listos, nuevos, loading: false });
            }
        }
        if (listos && nuevos && procesosBloqueados) {
            if (listos.length === 0 && nuevos.length === 0 && procesosBloqueados.length === 0 && procesoActual === null) {
                this.setState({ complete: true });
            }
        }
    }

    stopProcess = () => {
        var procesoActual = this.state.procesoActual;
        var procesosBloqueados = this.state.procesosBloqueados;
        if (procesoActual) {
            this.setState({ loading: true });
            procesoActual.blocked = 7;
            procesoActual.time = Math.ceil(procesoActual.time - this.state.progresoActual);
            procesosBloqueados.push(procesoActual);
            this.setState({ procesosBloqueados, progresoActual: 0 });
            this.getProces();
            this.setState({ loading: false })
        }
        else {
            this.setState({ complete: true })
        }
    }

    failProcess = () => {
        var procesoActual = this.state.procesoActual;
        var procesosTerminados = this.state.procesosTerminados;
        if (procesoActual) {
            this.setState({ loading: true, progresoActual: 0 });
            procesosTerminados.push(this.getFinishedProcess(procesoActual,true));
            procesoActual = null;
            this.setState({ procesosTerminados, procesoActual });
            this.getProces();
            this.setState({ loading: false })
            this.feedNew();
        }
        else {
            this.setState({ complete: true })
        }
    }

    endProces = () => {
        var procesoActual = this.state.procesoActual;
        var procesosTerminados = this.state.procesosTerminados;
        if (procesoActual) {
            this.setState({ loading: true, progresoActual: 0 });
            procesosTerminados.push(this.getFinishedProcess(procesoActual,false));
            procesoActual = null;
            this.setState({ procesosTerminados, procesoActual });
            this.getProces();
            this.setState({ loading: false })
                this.feedNew();
        }
        else {
            this.setState({ complete: true })
        }
    }

    renderInfo = () => {
        const terminados = this.state.procesosTerminados;
        return <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                <Card hoverable title={
                        `Información`
                }
                    className="card-info" bordered={false}
                    extra={
                            <AllInboxIcon />
                    }
                >
                    <Table columns={columnFinals} pagination={false} bordered
                        size="small" onChange={() => { }}
                        dataSource={
                            this.state.loading ? [] :
                        terminados
                        } scroll={{ y: 250 }}

                    />
                </Card>
        </Col>
    }

    renderlistos = () => {
        const listos = this.state.listos;
        const nuevos = this.state.nuevos;
        const done = listos.length === 0 && nuevos.length === 0;
        return <Col xs={24} sm={24} md={24} lg={8} xl={8} >
            {!done ?
                <Card hoverable title={
                    listos !== null ?
                        `Procesos Listos: ${listos.length}` :
                        `Sin procesos`
                }
                    className="card" bordered={false}
                    extra={
                        <Badge count={
                            done !== null ?
                                <Spin size="small" /> :
                                null}>
                            <AllInboxIcon />
                        </Badge>
                    }
                >
                    <Table columns={columnsNuevos} pagination={false} bordered
                        size="small" onChange={() => { }}
                        dataSource={this.state.loading ? [] :
                            listos
                        } scroll={{ y: 150 }}

                    />
                </Card> :
                <Result status="success"
                    title="Sin Procesos Pendientes"
                />
            }
        </Col>
    }

    renderNuevos = () => {
        const nuevos = this.state.nuevos;
        return <Col xs={24} sm={24} md={24} lg={8} xl={8} >{
            nuevos.length > 0 ?
                <Card hoverable title={
                    nuevos.length > 0 ?
                        `Procesos Nuevos: ${nuevos.length}` :
                        `Sin procesos nuevos`
                }
                    className="card" bordered={false}
                    extra={
                        <Badge count={
                            nuevos.length > 0 ?
                                <Spin size="small" /> :
                                null}>
                            <AllInboxIcon />
                        </Badge>
                    }
                >
                    <Table columns={columnsNuevos} pagination={false} bordered
                        size="small" onChange={() => { }}
                        dataSource={this.state.loading ? [] :
                            nuevos
                        } scroll={{ y: 150 }}

                    />
                </Card> :
                <Result status="success"
                    title="Sin Procesos Nuevos"
                />
        }
        </Col>
    }

    renderOp = (op, type) => {
        switch (op.op) {
            case 1:
                return type === 1 ? `${op.a} + ${op.b}` : op.a + op.b;
            case 2:
                return type === 1 ? `${op.a} - ${op.b}` : op.a - op.b;
            case 3:
                return type === 1 ? `${op.a} / ${op.b}` : (op.a / op.b).toFixed(3);
            case 4:
                return type === 1 ? `${op.a} * ${op.b}` : op.a * op.b;
            case 5:
                return type === 1 ? `${op.a} % ${op.b}` : op.a % op.b;
            case 6:
                return type === 1 ? `${op.a} ^ ${op.b}` : op.a ^ op.b;
            default:
                return type === 1 ? '?' : 0;
        }
    }

    getFinishedProcess = (input,error) => {
        const time = this.state.contadorGlobal;
        const tRetorno = time - input.tiempoLlegada;
        const tEsp = (tRetorno - input.ttrans)<0?0:
        tRetorno - input.ttrans;
        if( input.tiempoRespuesta < 0) input.tiempoRespuesta = 0;
        var output = {
            id: input.id,
            op: this.renderOp(input.proc, 1),
            res: error?"ERROR":this.renderOp(input.proc, 2),
            time: input.time,
            tiempoLlegada: input.tiempoLlegada,
            tiempoFin: time,
            ttrans: input.ttrans, //tiempoServicio
            tiempoRetorno: tRetorno,
            tiempoEspera: tEsp,
            tiempoRespuesta: input.tiempoRespuesta
        }
        return output;
    }

    getFailedProcess = input => {
        var output = {
            id: input.id,
            op: this.renderOp(input.proc, 1),
            res: "ERROR"
        }
        return output;
    }

    renderProcesoActual = () => {
        var procesoActual = this.state.procesoActual;
        var tiempoTranscurrido = Math.ceil(this.state.progresoActual)
        var listos = this.state.listos;
        var nuevos = this.state.nuevos;
        var bloqueados = this.state.procesosBloqueados;
        var tiempoRestante = procesoActual !== null ?
            Math.ceil(procesoActual.time - this.state.progresoActual)
            : 0;
        var done = false;
        if (listos && bloqueados && nuevos) {
            done = listos.length === 0 && nuevos.length === 0 && bloqueados.length === 0 && procesoActual === null
        }
        return <Col xs={24} sm={24} md={24} lg={8} xl={8} >{
            !done ?
                <Card hoverable title={procesoActual !== null ?
                    `Proceso Actual: ${procesoActual.id}` :
                    `Proceso Nulo`
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
                                            (this.state.progresoActual * 100) /
                                            procesoActual.time) :
                                        0
                                } />
                        </Col>
                        {procesoActual !== null ?
                            <Col xs={8} sm={8} md={8} lg={12} xl={12}
                                className="info" >
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
                </Card> :
                <Result status="success"
                    title="Procesos Finalizados"
                />
        }
        </Col>
    }

    renderTerminados = () => {
        var terminados = [];
        terminados = this.state.procesosTerminados;

        return <Col xs={24} sm={24} md={24} lg={8} xl={8} >
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

    renderBloqueados = () => {
        var procesoActual = this.state.procesoActual;
        var listos = this.state.listos;
        var nuevos = this.state.nuevos;
        var bloqueados = [];
        bloqueados = this.state.procesosBloqueados;
        var done = false;
        if (listos && bloqueados && nuevos) {
            done = listos.length === 0 && nuevos.length === 0 && bloqueados.length === 0 && procesoActual === null
        }
        return <Col xs={24} sm={24} md={24} lg={8} xl={8} >{
            !done ?
                <Card hoverable title={`Procesos Bloqueados: ${bloqueados.length}`}
                    className="card" bordered={false}
                    extra={
                        <Badge count={bloqueados.length}>
                            <CheckCircleOutlineIcon />
                        </Badge>
                    }
                >
                    <Table columns={columnsBlocked} pagination={false} bordered
                        size="small" onChange={() => { }}
                        loading={this.state.loading}
                        dataSource={this.state.loading ? [] :
                            bloqueados
                        } scroll={{ y: 150 }}

                    />
                </Card> :
                <Result status="success"
                    title="Procesos Finalizados"
                />
        }
        </Col>
    }

    renderMonitor = () => {
        var pendientes = this.state.nuevos.length + this.state.listos.length
        var procesoActual = this.state.procesoActual !== null ?
            this.state.procesoActual.id : 0;
        var procesosTerminados = this.state.procesosTerminados.length;
        var global = this.state.contadorGlobal;
        var complete = this.state.complete;
        return <Col xs={24} sm={24} md={24} lg={8} xl={8} >
            <Card hoverable title={!complete ?
                `Monitor ${this.state.pause === true ? "en espera" : ""}` :
                `Monitor: Terminado`
            }
                className="monitor-card" bordered={false}
                extra={<DesktopMacIcon />}
            >
                <List size="small">
                    <List.Item>
                        <Row className="monitor-row">
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}
                                className="monitor-col">
                                <Statistic title="P. Pendientes"
                                    value={pendientes}
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
                {
                    document.addEventListener("keypress", this.logKey)
                }
                {
                    this.renderNuevos()
                }
                {this.state.listos ||
                    this.state.procesosTerminados.length > 0 ? (
                        this.renderlistos()
                    ) :
                    null
                }
                {
                    this.renderProcesoActual()

                }
                {   this.state.complete? null:
                    this.renderBloqueados()
                }
                {   this.state.complete? null:
                    this.renderTerminados()
                }
                {   this.state.complete? null:
                    this.renderMonitor()
                }
                {   this.state.complete?
                    this.renderInfo():
                    null
                }
            </Row>
        )
    }
}
