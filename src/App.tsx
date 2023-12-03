import React from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import UploadFilePage from "./layouts/UploadFilePage/UploadFilePage";
import TextExtractionPage from "./layouts/TextExtractionPage/TextExtractionPage";
import HomePage from "./layouts/HomePage/HomePage";

function App() {
  return(
    <div className="w-100 h-100 d-flex justify-content-center">
      <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/upload" element={<UploadFilePage/>} />
          <Route path="/text-extraction" element={<TextExtractionPage/>} />
      </Routes>
    </div>
  )
}

export default App;
