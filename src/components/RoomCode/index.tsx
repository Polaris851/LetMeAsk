import copyImg from '../../assets/images/copy.svg';

import '../RoomCode/style.scss';

type RoomCodeProps = {
    code: string | undefined;
}

export function RoomCode(props: RoomCodeProps) {
    return(
        <button className="room-code">
            <div>
                <img src={copyImg} alt="copy room code" />
            </div>
            <span>Sala #{props.code}</span>
        </button>
    );
}