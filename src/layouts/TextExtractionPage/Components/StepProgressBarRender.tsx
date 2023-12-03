import React, {useEffect, useState} from "react";
import StepProgressBar from "./StepProgressBar/StepProgressBar";
import {TextExtractionEventStatus, TextExtractionMessageChannel} from "./StepProgressBar/StepProgressBarConst";

interface TextExtractionEventData {
    status: string,
    result: string
}

const baseUrl = process.env.REACT_APP_BASE_API_URL;

export default function StepProgressBarRender({processId, setExtractedText}:{
    processId: string,
    setExtractedText: React.Dispatch<React.SetStateAction<string>>
}) {
    let [progress, setProgress] = useState<string>("");
    let [result, setResult] = useState<string>("");
    let [isExtractingCompleted, setIsExtractingCompleted] = useState<boolean>(false);

    useEffect(() => {
        if (!isExtractingCompleted)
            return;

        setExtractedText(result);
    }, [isExtractingCompleted])

    useEffect(() => {
        if (!processId)
            return;

        setProgress(TextExtractionEventStatus.START);

        const eventSource = new EventSource(`${baseUrl}/text-extraction/emitter/${processId}`);

        eventSource.onopen = () => {}

        eventSource.addEventListener(TextExtractionMessageChannel.SUCCESSFUL, (event) => {
            const eventData: TextExtractionEventData = JSON.parse(event.data);
            setProgress(eventData.status);

            if (eventData.status === TextExtractionEventStatus.FORMATTED) {
                setResult(eventData.result);
                eventSource.close();
            }
        });
        eventSource.addEventListener(TextExtractionMessageChannel.FAILED, (event) => {
            const eventData: TextExtractionEventData = JSON.parse(event.data);
            setProgress(eventData.status);
            eventSource.close();
        });

        eventSource.onerror = (e) => {
            eventSource.close();
        }

        return () => {
            eventSource.close();
        }
    }, [processId]);

    return(
        <div className="w-100 p-2">
            <StepProgressBar
                progress={progress}
                setIsExtractingCompleted={setIsExtractingCompleted}/>
        </div>
    )
}