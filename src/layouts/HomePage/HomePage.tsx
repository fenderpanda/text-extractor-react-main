import {useNavigate} from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate("/upload");
    }

    return(
        <div className="container-fluid d-flex justify-content-center">
            <div className="container w-75 d-flex flex-column text-center">
                <h1>
                    Welcome to text extraction from an image
                </h1>
                <div className="d-flex justify-content-center mt-3">
                    <div className="btn btn-success w-25"
                         onClick={handleStartClick}
                    >Let's begin!</div>
                </div>
            </div>
        </div>
    )
}