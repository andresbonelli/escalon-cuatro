import { CountdownCircleTimer } from "react-countdown-circle-timer";

export default function Timer({onComplete}) {
    
    return (
        <CountdownCircleTimer
            isPlaying
            duration={10}
            colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
            colorsTime={[60, 45, 30, 0]}
            onComplete={onComplete}
        />

    );
    
};
