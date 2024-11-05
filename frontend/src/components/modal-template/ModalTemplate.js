import React from 'react'

const TemplateCommon = ({title, header, row}) => {
    return <>
        <h5 className="text-center text-primary mb-3">UPLOAD {title} ASSESS FROM FILE (.xls, .xlsx)</h5>
        <table className="table">
            <thead>
                <tr>{header.map((itm, idx) => (<th key={idx} scope="col">{itm}</th>))}</tr>
            </thead>
            <tbody>
                <tr>{row.map((itm, idx) => (<td key={idx} scope="col">{itm}</td>))}</tr>
            </tbody>
        </table>
    </>
}

const TemplateSuperReview = () => {
    const title = 'SUPERVISOR'
    const header = ['No.', 'Employ Id', 'Student Id', 'Project Name', '1', '2', '3']
    const row = ['1', '111', '222', 'Confirm ..', 'D', 'D', 'C']
    return <TemplateCommon title={title} header={header} row={row} />
}
export const MemoizedTemplateSuperReview = React.memo(TemplateSuperReview)

const TemplateReviewer = () => {
    const title = 'REVIEWER'
    const header = ['No.', 'Student Id', 'Project Name', '1', '2', '3']
    const row = ['1', '222', 'Confirm ..', 'D', 'D', 'C']
    return <TemplateCommon title={title} header={header} row={row} />
}
export const MemoizedTemplateReviewer = React.memo(TemplateReviewer)

const TemplateIntern = () => {
    const title = 'INTERN'
    const header = [ 'No.','Student Id','Company' , 'P.1', 'P.2', '...']
    const row = ['1','11111', 'AAA', '4', '4', '...']
    return <TemplateCommon title={title} header={header} row={row} />
}
export const MemoizedTemplateIntern = React.memo(TemplateIntern)


const TemplateMemberParticipant = () => {
    const title = 'MEMBER'
    const header = ['No.', 'Project Name', 'Q1', 'Q2', '...']
    const row = ['1', 'Tìm hiểu sóng não EEG, sử dụng trong điều khiển đơn giản', 'C', 'D', '...']
    return <TemplateCommon title={title} header={header} row={row} />
}
export const MemoizedTemplateMemberParticipant = React.memo(TemplateMemberParticipant)


const TemplateExit = () => {
    const title = 'EXIT SURVEY'
    const header = ['No.', 'Student Id', 'C1', 'C1-1', 'C1-2']
    const row = ['1', '222222', '3', '1', '3']
    return <TemplateCommon title={title} header={header} row={row} />
}
export const MemoizedTemplateExit = React.memo(TemplateExit)


const TemplateCommitte = () => {
    const title = 'COMMITTEE'
    const header = ['No.', 'Lecturer Id', 'Student Id', 'Project Name', 'Q1', 'Q2']
    const row = ['1', '12345', '12356', 'aaa', 'A', 'B']
    return <TemplateCommon title={title} header={header} row={row} />
}
export const MemoizedTemplateCommitte = React.memo(TemplateCommitte)

const TemplateCEHD = () => {
    const title = 'CE HD'
    const header = ['No.', 'Lecturer Id', 'Student Id', 'Q1', 'Q2']
    const row = ['1', '12345', '12356', 'A', 'B']
    return <TemplateCommon title={title} header={header} row={row} />
}
export const MemoizedTemplateCEHD = React.memo(TemplateCEHD)

const TemplateCEDSupervisor = () => {
    const title = 'CE SUPERVISOR'
    const header = ['No.', 'Lecturer Id', 'Student Id', 'Q1', 'Q2']
    const row = ['1', '12345', '12356', 'A', 'B']
    return <TemplateCommon title={title} header={header} row={row} />
}
export const MemoizedTemplateCEDSupervisor = React.memo(TemplateCEDSupervisor)

const TemplateCEDParticipant = () => {
    const title = 'CE PARTICIPANT'
    const header = ['No.', 'Participant', 'Student Name','Student Id', 'Q1', 'Q2']
    const row = ['1', 'Nguyen Van B', 'Nguyen Van A', '123456', 'B', 'C']
    return <TemplateCommon title={title} header={header} row={row} />
}
export const MemoizedTemplateCEDParticipant = React.memo(TemplateCEDParticipant)

const TemplateTestResult = () => {
    const title = 'TEST RESULT'
    const header = ['No.', 'Student Id', 'Q1', 'Q2', 'Q3']
    const row = ['1', '1612547', 'A', 'B', 'C']
    return <TemplateCommon title={title} header={header} row={row} />
}
export const MemoizedTemplateTestResult = React.memo(TemplateTestResult)

const TemplateFoundationTestResult = () => {
    const title = 'TEST RESULT'
    const header = ['No.', 'Student Id', 'Q1', 'Q2', 'Q3']
    const row = ['1', '1612547', 'A', 'B', 'C']
    return <TemplateCommon title={title} header={header} row={row} />
}
export const MemoizedTemplateFoundationTestResult = React.memo(TemplateFoundationTestResult)
