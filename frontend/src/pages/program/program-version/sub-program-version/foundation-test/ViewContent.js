import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { getVersionFoundationTestQuestionActionApi } from '../../../../../actions/api-actions/ProgramAction';

export default function ViewContent(props) {

    const dispatch = useDispatch();
    const {
        versionFoundationTestQuestions,
    } = useSelector((state) => state.GeneralProgramReducer);

    useEffect(() => {
        dispatch(getVersionFoundationTestQuestionActionApi(props.location.pathname.split('/')[2],  1, 1000, []));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.location.pathname.split('/')[2]]);

    const renderQuestions = () => {
        return versionFoundationTestQuestions?.data?.map((question, idx) => {
            return <div key={`${question.id}-${idx}`}>
            <p><strong>Question {idx+1}.</strong><span className='ml-2'>{question.content}</span></p>
            { question.image && <img src={`http://13.214.16.222:8000/api/images/${question.image}`} alt={question.image} width="40%" height="auto" /> }
            {
                question.answerSet?.map((answer, idx) => {
                    return <div key={`${answer.answerId}-${idx}`}>
                    <p key={`${question.id}-${answer.answerId}-${idx}`}>{answer.answerId}. {answer.description} </p>
                    { answer.image && <img src={`http://13.214.16.222:8000/api/images/${answer.image}`} alt={answer.image} width="40%" height="auto" /> }
                </div>
                })
            }
        </div>
        })
    }
    
  return (
    <div className='py-3'>
        <h5 className='text-center'>List question</h5>
        {renderQuestions()}
    </div>
  )
}
