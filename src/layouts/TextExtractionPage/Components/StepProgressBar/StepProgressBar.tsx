import "./StepProgressBar.css";
import React, {useEffect, useState} from "react";
import {TextExtractionEventStatus} from "./StepProgressBarConst";

export default function StepProgressBar({progress, setIsExtractingCompleted}:{
    progress: string,
    setIsExtractingCompleted: React.Dispatch<React.SetStateAction<boolean>>
}) {
    let [isConvertingRunning, setIsConvertingRunning] = useState<boolean>(false);
    let [isConvertingCompleted, setIsConvertingCompleted] = useState<boolean>(false);
    let [isConvertingError, setIsConvertingError] = useState<boolean>(false);

    let [isTextExtractionRunning, setIsTextExtractionRunning] = useState<boolean>(false);
    let [isTextExtractionCompleted, setIsTextExtractionCompleted] = useState<boolean>(false);
    let [isTextExtractionError, setIsTextExtractionError] = useState<boolean>(false);

    let [isFormattingTextRunning, setIsFormattingTextRunning] = useState<boolean>(false);
    let [isFormattingTextCompleted, setIsFormattingTextCompleted] = useState<boolean>(false);
    let [isFormattingTextError, setIsFormattingTextError] = useState<boolean>(false);

    let [progressBarWidth, setProgressBarWidth] = useState<number>(0);

    function hasError():boolean {
        return isConvertingError || isTextExtractionError || isFormattingTextError;
    }

    function validateProgress(progress: string):void {
        if (progress === TextExtractionEventStatus.FAILED_CONVERTING) {
            setIsConvertingError(true);
        }

        if (progress === TextExtractionEventStatus.FAILED_EXTRACTING) {
            setIsTextExtractionError(true);
        }

        if (progress === TextExtractionEventStatus.CONVERTED) {
            setIsConvertingRunning(false);
            setIsConvertingCompleted(true);
            setProgressBarWidth(50);
        }

        if (progress === TextExtractionEventStatus.EXTRACTED) {
            if (!isConvertingCompleted) {
                setIsConvertingCompleted(true);
            }

            setIsTextExtractionRunning(false);
            setIsTextExtractionCompleted(true);
            setProgressBarWidth(100);
        }

        if (progress === TextExtractionEventStatus.FORMATTED) {
            if (!isConvertingCompleted) {
                setIsConvertingCompleted(true);
            }

            if (!isTextExtractionCompleted) {
                setIsTextExtractionCompleted(true);
            }

            setIsFormattingTextRunning(false);
            setIsFormattingTextCompleted(true);
            setProgressBarWidth(100);
        }
    }

    useEffect(() => {
        if (progress === TextExtractionEventStatus.START) {
            setIsConvertingRunning(true);
        }
    },[progress]);

    return(
        <div className="w-100 d-flex justify-content-center">
            <div className="w-100 position-relative d-flex flex-row">
                <div className="w-100 h-100 position-absolute d-flex align-items-center"
                     style={{zIndex: -1}}>
                    <div className="ms-4 me-4 w-100">
                        <div className="step-progress-bar"
                             style={{zIndex: -1, height: "10px", width: progressBarWidth + "%"}}></div>
                    </div>

                </div>
                <div className="col-4 d-flex justify-content-start">
                    <div className="d-flex align-items-center">
                        <div className={`d-flex align-items-center justify-content-center bg-white rounded-circle
                             ${isConvertingRunning ? "pulsing" : ""}
                             ${isConvertingCompleted ? "pulsing-final-step" : ""}
                             ${isConvertingError ? "error-step" : ""}`}
                             onAnimationIteration={() => {
                                 validateProgress(progress);
                             }}
                             onAnimationEnd={() => {
                                 if (!hasError()) {
                                     setIsTextExtractionRunning(true);
                                 }
                             }}
                             style={{width: "46px", height: "46px", border: "2px solid black"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                                 className="bi bi-file-earmark-richtext" viewBox="0 0 16 16">
                                <path
                                    d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                                <path
                                    d="M4.5 12.5A.5.5 0 0 1 5 12h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0-2A.5.5 0 0 1 5 10h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm1.639-3.708 1.33.886 1.854-1.855a.25.25 0 0 1 .289-.047l1.888.974V8.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V8s1.54-1.274 1.639-1.208zM6.25 6a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="col-4 d-flex justify-content-center">
                    <div className="d-flex align-items-center">
                        <div className={`d-flex align-items-center justify-content-center bg-white rounded-circle
                             ${isTextExtractionRunning ? "pulsing" : ""}
                             ${isTextExtractionCompleted ? "pulsing-final-step" : ""}
                             ${isTextExtractionError ? "error-step" : ""}`}
                             onAnimationIteration={() => {
                                 validateProgress(progress);
                             }}
                             onAnimationEnd={() => {
                                 if (!hasError()) {
                                     setIsFormattingTextRunning(true);
                                 }
                             }}
                             style={{width: "46px", height: "46px", border: "2px solid black"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                                 className="bi bi-braces" viewBox="0 0 16 16">
                                <path
                                    d="M2.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C3.25 2 2.49 2.759 2.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6zM13.886 7.9v.163c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456V7.332c-1.114 0-1.49-.362-1.49-1.456V4.352C13.51 2.759 12.75 2 11.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="col-4 d-flex justify-content-end">
                    <div className="d-flex align-items-center">
                        <div className={`d-flex align-items-center justify-content-center bg-white rounded-circle
                             ${isFormattingTextRunning ? "pulsing" : ""}
                             ${isFormattingTextCompleted ? "pulsing-final-step" : ""}
                             ${isFormattingTextError ? "error-step" : ""}`}
                             onAnimationIteration={() => {
                                 validateProgress(progress);
                             }}
                             onAnimationEnd={() => {
                                 if (!hasError()) {
                                     setIsExtractingCompleted(true);
                                 }
                             }}
                             style={{width: "46px", height: "46px", border: "2px solid black"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                                 className="bi bi-justify-left" viewBox="0 0 16 16">
                                <path fillRule="evenodd"
                                      d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}