import { CountdownCircleTimer } from "react-countdown-circle-timer";

export default function Timer({onComplete}) {
    
    return (
        <CountdownCircleTimer
            isPlaying
            duration={60}
            colors={["#004777", "#00C000", "#FFE733", "#FFAA1C", "#FF8C01", "#ED2938", "#A30000"]} 
            colorsTime={[60, 50, 40, 30, 20, 10, 0]}
            trailColor="BED61B"
            onComplete={onComplete}
        />

    );
    
};
