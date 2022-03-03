import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import APP from './App';
import reportWebVitals from './reportWebVitals';

// 어떤 주소로 왔을때 무엇을 보여줄지 정의하는 곳
ReactDOM.render(
    <BrowserRouter><APP /></BrowserRouter>,
    document.getElementById('root')
);

reportWebVitals();