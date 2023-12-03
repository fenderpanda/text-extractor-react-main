import "../../App.css";
import {Button, Modal} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

export default function ErrorDialog({errorMessage}: {
    errorMessage: string
}) {
    const navigate = useNavigate();

    const handleTryAgainClick = () => {
        navigate("/");
    }

    return(
        <Modal
            contentClassName="error-dialog-main"
            centered={true}
            show={true}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Body>
                <div className="d-flex justify-content-center align-items-center"
                     style={{height: "100px"}}
                >
                    <div className="d-inline-block text-center error-text-color"
                         style={{fontSize: "26px"}}
                    >
                        {errorMessage}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn btn-primary" onClick={handleTryAgainClick}>
                    Try again
                </Button>
            </Modal.Footer>
        </Modal>
    )
}