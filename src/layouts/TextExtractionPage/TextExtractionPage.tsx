import ImageFileRender from "./Components/ImageFileRender";
import {useLocation, useNavigate} from "react-router-dom";
import ExtractedTextRender from "./Components/ExtractedTextRender";
import {useEffect, useState} from "react";
import {ImageFile} from "../../types/app";
import StepProgressBarRender from "./Components/StepProgressBarRender";

export default function TextExtractionPage() {
    let navigate = useNavigate();
    const imageFile: ImageFile | null = useLocation().state;

    let [showUploadNewFile, setShowUploadNewFile] = useState<boolean>(false);

    let [processId, setProcessId] = useState<string>("");
    let [extractedText, setExtractedText] = useState<string>("");

    useEffect(() => {
        if (extractedText === "")
            return;

        setShowUploadNewFile(true);
    },[extractedText])

    const redirectToUploadPage = () => {
        navigate("/upload");
    }

    return(
        <div className="container-fluid d-flex flex-column">
            <div className="container d-flex flex-row justify-content-center">
                <div className="col-3 d-flex align-self-center">
                    {showUploadNewFile && <button
                        className="btn btn-success"
                        onClick={redirectToUploadPage}>Upload New File</button>}
                </div>
                <div className="col-6 d-flex justify-content-center">
                    <StepProgressBarRender
                        processId={processId}
                        setExtractedText={setExtractedText}/>
                </div>
                <div className="col-3"></div>
            </div>
            <div className="container d-flex flex-row border border-secondary rounded"
                 style={{maxWidth: "1300px"}}
            >
                <div className="col-6" style={{borderRight: "1px solid black"}}>
                    <ImageFileRender imageFile={imageFile}/>
                </div>
                <div className="col-6">
                    <ExtractedTextRender
                        imageFileId={imageFile?.id}
                        setProcessId={setProcessId}
                        extractedText={extractedText}/>
                </div>
            </div>
        </div>
    )
}