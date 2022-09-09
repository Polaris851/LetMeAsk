import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import '../styles/room.scss';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const navigation = useNavigate();
    const { questions, title} = useRoom(roomId);
       
  
    async function handleEndRoom() {
        if(window.confirm('Tem certeza que voce deseja excluir esta sala?')) {
            await database.ref(`rooms/${roomId}`).update({
                endedAt: new Date(),
            });
            navigation('/');
        }
    }

    async function handleDeleteQuestion(questionId: string) {
        if(window.confirm('Tem certeza que voce deseja excluir esta pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        });
    }

    async function handleHighLightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighLighted: true,
        });
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="LetMeAsk" />
                    <div>
                        <RoomCode code={roomId}/>
                        <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && 
                    <span>{questions.length} pergunta(s)</span>}
                </div>
                <div className="question-list">
                {questions.map(question => {
                    return(
                        <Question
                         key={question.id}
                         content={question.content}
                         author={question.author}
                         isAnswered={question.isAnswered}
                         isHighLighted={question.isHighLighted}
                         >
                            {!question.isAnswered && (
                                <>
                                <button
                                 type='button'
                                 className='icon'
                                 onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                >
                                    <img src={checkImg} alt="Marcar a pergunta como respondida" />
                                </button>
                                <button
                                 type='button'
                                 className='icon'
                                onClick={() => handleHighLightQuestion(question.id)}
                                >
                                    <img src={answerImg} alt="Respodendo a pergunta" />
                                </button>
                                </>
                            )}
                            <button
                             type='button'
                             className='icon-delete'
                             aria-label='Remover a pergunta'
                             onClick={() => handleDeleteQuestion(question.id)}
                            >
                                <img src={deleteImg} alt="Remover pergunta" />
                            </button>
                     </Question>
                    )
                })}
                </div>
            </main>
        </div>
    );
}