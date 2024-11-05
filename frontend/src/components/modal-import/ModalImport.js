import { Modal } from 'antd';
import React from 'react'

export default function ModalImport(props) {
    const { isVisible, children } = props

    const handleOk = () => {
        props.updateModal(false)
    }

    const handleCancel = () => {
        props.updateModal(false)
    }

    return (
        <Modal width={700} footer={null} visible={isVisible} onOk={handleOk} onCancel={handleCancel}>
            {children}
        </Modal>
    )
}
