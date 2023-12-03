import {useEffect, useState} from "react";
import Axios from "../../../axios/Axios";
import {useNavigate} from "react-router-dom";
import {ImageFile} from "../../../types/app";
import ErrorDialog from "../../../utils/ErrorDialog/ErrorDialog";
import errorTemplate from "../../../utils/errorTemplate";

const inputLabel = {
    default: "Choose File"
}

const progressLevel = {
    notStarted: "",
    completed: "Processing..."
}

export default function UploadFile() {
    let navigate = useNavigate();

    let [serverError, setServerError] = useState<string>("");
    let [badRequestError, setBadRequestError] = useState<string>("");

    let [uploadedFile, setUploadedFile] = useState<any>(null);
    let [filename, setFilename] = useState<string>(inputLabel.default);
    let [progress, setProgress] = useState<number>(0);

    let [isUploading, setIsUploading] = useState<boolean>(false);

    const setDefaultStates = () => {
        setFilename(inputLabel.default);
        setProgress(0);
        setIsUploading(false);
    }

    useEffect(() => {
        if (!isUploading || !uploadedFile) {
            setIsUploading(false);
            return;
        }

        let data = new FormData();
        data.append("image-file", uploadedFile);

        Axios.post("/upload", {"image-file": uploadedFile}, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent: any) => {
                setProgress(Math.round(progressEvent.loaded / progressEvent.total * 100))
            }
        })
            .then((response) => {
                setDefaultStates();
                const imageFile: ImageFile = response.data;
                navigate("/text-extraction", {state: imageFile});
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    if (error.response.status === 400) {
                        setBadRequestError(error.response.data);
                    } else if (error.response.status === 502) {
                        setServerError(error.response.data);
                    }
                } else if (error.request) {
                    setServerError(errorTemplate.request);
                } else {
                    setServerError(errorTemplate.unexpected);
                }

                setDefaultStates();
            })

    },[isUploading])

    function handleUploadProgress(progress: number): string {
        if (progress === 0) {
            return progressLevel.notStarted;
        }

        if (progress === 100) {
            return progressLevel.completed;
        }

        return progress + "%";
    }

    const handleFileUpload = (event: any) => {
        const file = event.target.files[0];

        if (!!file) {
            setFilename(file.name);
            setUploadedFile(file);
            setBadRequestError("");
        }
    }

    const handleUploadClick = () => {
        setIsUploading(true);
    }

    return(
        <>
            <div className="d-flex flex-column w-50 px-2 my-2 border border-secondary rounded">
                <div className="text-center p-2">
                    Upload file for text extraction<br/>
                    An image must contains English words<br/>
                    We support follow formats: jpg, jpeg, png, heic, pdf.<br/>
                    Pdf file must contains only one page.<br/>
                    Maximum file size is 10MB
                </div>
                <div className="d-flex flex-row py-2 border border-primary rounded">
                    <div className="d-flex justify-content-center align-items-center col-2">Upload File</div>
                    <div className="d-flex flex-column col-10 my-auto py-1 px-2">
                        <label className={`d-flex align-items-center px-2 position-relative
                               ${badRequestError ? "error" : ""}`}
                               style={{height: "30px"}}
                               htmlFor="customFile"
                        >{filename}
                            <div className="position-absolute top-0 start-0 h-100"
                                 style={{width: progress + "%", background: "blue"}}></div>
                            <div className={`position-absolute top-0 start-0 h-100 w-100
                                d-flex justify-content-center align-items-center
                                ${badRequestError ? "" : "border border-secondary"}
                                `}>
                                {handleUploadProgress(progress)}
                            </div>
                        </label>
                        <input type='file'
                               id="customFile"
                               style={{visibility: "hidden", width: 0, height: 0}}
                               onClick={(event: any) => {event.target.value = null}}
                               onChange={handleFileUpload}
                        />
                        {badRequestError && <div className="d-flex justify-content-center">
                            <div className="d-inline-block text-center error-text-color">
                                {badRequestError}
                            </div>
                        </div>}
                    </div>
                </div>
                <div className="d-flex flex-row justify-content-center m-2">
                    <div className="btn btn-success w-25" onClick={handleUploadClick}>Upload File</div>
                </div>
            </div>
            {serverError && <ErrorDialog errorMessage={serverError}/>}
        </>
    )
}