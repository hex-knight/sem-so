import { Divider, Table } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React from 'react'

export default function ModalInfo(props) {
    const data=[
        {
            key:'1',
            tarea:'Tarea 1'
        }
    ]
    const columns=[
        {
            title: `Tareas (${data.length})`,
            dataIndex : 'tarea',
            key:'tarea'
        }
    ]
    return (
        <Modal
            title="Seminario de Sistemas Operativos"
            visible={props.visible}
            onOk={() => props.closeModal()}
            onCancel={() => props.closeModal()}
        >
            <p>Mariscal Fernández Eduardo David</p>
            <h4>Código</h4>
            <p>213548579</p>
            <h4>Correo</h4>
            <a href="mailto:eduardo.mariscal5485@alumnos.udg.mx">
                eduardo.mariscal5485@alumnos.udg.mx
          </a>
          <Divider />
          <Table
            onRow={ (record) => {
                return {
                    onClick: () => {
                        console.log(record)
                        props.changePage(parseInt(record.key))
                    }
                }
            }}
            dataSource={data}
            columns={columns}
            pagination={false}
            scroll={{ y : 100 }}
        />
        </Modal>
    )
}

