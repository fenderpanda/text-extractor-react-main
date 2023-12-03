import React, {useEffect, useState} from "react";
import Axios from "../../../axios/Axios";
import errorTemplate from "../../../utils/errorTemplate";
import ErrorDialog from "../../../utils/ErrorDialog/ErrorDialog";

const languages = new Map()
    .set("eng", "English")
    .set("rus", "Русский");

export default function ExtractedTextRender({imageFileId, setProcessId, extractedText}: {
    imageFileId: number | undefined,
    setProcessId: React.Dispatch<React.SetStateAction<string>>,
    extractedText: string
}) {
    let [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
    let [errorMessage, setErrorMessage] = useState<string>("");

    let [lang, setLang] = useState<string>("eng");

    let [isExtractingText, setIsExtractingText] = useState<boolean>(false);
    let [showExtractTextMenu, setShowExtractTextMenu] = useState<boolean>(true);

    useEffect(() => {
        if (!isExtractingText || (imageFileId === undefined)) {
            setIsExtractingText(false);
            return;
        }

        Axios.get(`/text-extraction/image-file/${imageFileId}/lang/${lang}`)
            .then((response) => {
                setProcessId(response.data);
                setIsExtractingText(false);
            })
            .catch((error) => {
                if (error.response) {
                    setErrorMessage(error.response.data);
                } else if (error.request) {
                    setErrorMessage(errorTemplate.request);
                } else {
                    setErrorMessage(errorTemplate.unexpected);
                }

                setIsExtractingText(false);
                setShowErrorDialog(true);
            })
    }, [isExtractingText])

    const handleTextExtractionClick = () => {
        setIsExtractingText(true);
        setShowExtractTextMenu(false);
    }

    return(
        <>
            <div style={{maxWidth: "100%", height: "100%", fontSize: "12px"}}>
                {showExtractTextMenu && <div className="h-100 d-flex flex-column">
                    <div className="d-flex flex-fill justify-content-center align-items-center">
                        <div className="d-flex flex-column">
                            <div style={{fontSize: "22px"}}>
                                Choose the <b><span style={{color: "red"}}>original</span></b> language of the image to the left
                            </div>
                            <div className="d-flex justify-content-center mt-1">
                                <div className="dropdown">
                                    <button className="btn btn-outline-dark dropdown-toggle" id="dropdownLang"
                                            data-bs-toggle="dropdown" aria-expanded="false">
                                        {languages.get(lang)}
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownLang">
                                        {Array.from(languages.keys()).map((key) => (
                                            <li key={key}>
                                                <button className="dropdown-item"
                                                        onClick={() => {setLang(key)}}
                                                        value={key}>{languages.get(key)}</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-fill">
                        <div className="container h-100 d-flex justify-content-center">
                            <div className="d-flex btn btn-success rounded-circle align-items-center"
                                 style={{width: "120px", height: "120px", fontSize: "24px"}}
                                 onClick={handleTextExtractionClick}
                            >Extract Text</div>
                        </div>
                    </div>
                    <div className="d-flex flex-fill"></div>
                </div>}
                {extractedText && <pre>{extractedText}</pre>}
            </div>
            {showErrorDialog && <ErrorDialog errorMessage={errorMessage}/>}
        </>
    )
}