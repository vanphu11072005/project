import React from "react";
import ReactDOM from "react-dom/client";               // Đây là module để render React App vào DOM (trang HTML). Chức năng: tạo “root” trong DOM và mount React component vào đó.
import { Provider } from "react-redux";                // cung cấp store Redux cho toàn bộ app React.
import { store } from "./store";
import { BrowserRouter } from "react-router-dom";      // Chức năng: cho phép dùng routing trong app (URL → component tương ứng).
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>                                            
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
