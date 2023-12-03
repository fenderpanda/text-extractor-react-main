import {ImageFile} from "../../../types/app";
import {useEffect, useState} from "react";
import {Document, Page} from "react-pdf";
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const ImageFileType = {
    PDF: "PDF",
    JPG: "JPG",
    PNG: "PNG",
    HEIC: "HEIC"
}

const imageFileFolder = process.env.REACT_APP_IMAGE_FILE_FOLDER;

export default function ImageFileRender({imageFile}: {
    imageFile: ImageFile | null
}) {
    let [isPdfFile, setIsPdfFile] = useState<boolean>(false);
    let [isPictureFile, setIsPictureFile] = useState<boolean>(false);
    let [pathToImageFile, setPathToImageFile] = useState<string>("");
    
    useEffect(() => {
        if (imageFile !== null) {
            setPathToImageFile(imageFileFolder + "/" + imageFile.fileLocation + "/" + imageFile.originalFilename);

            if (imageFile.type === ImageFileType.PDF) {
                setIsPdfFile(true);
            } else {
                setIsPictureFile(true);
            }
        }
    },[imageFile]);

    return(
        <>
            {isPdfFile && <Document file={pathToImageFile}>
                <Page pageNumber={imageFile?.pageAmount}/>
            </Document>}
            {isPictureFile && <img
                alt="Uploaded File"
                style={{maxWidth: "100%"}}
                src={pathToImageFile} />}
        </>
    )
}