import React from "react";
import '../../../assets/css/footer.css';

class Footer extends React.Component {

  render() {
    return (
        <div id="footer">
            <div id="footer-content">
                <div className="footer-blank"></div>
                <img className="mr30" src="/image/grey_logo.png" alt="footer_logo" />
                <div className="footer-content1">
                    <p>경북 포항시 북구 흥해읍 한동로 558 한동대학교 37554</p>
                    <p><a href="https://www.handong.edu/sinfo/persnal/">개인정보처리방침</a></p>
                    <p>copyright&copy; 2021 Handong Global Univ, all rights reserved.</p>
                </div>
                <div className="footer-content2">
                    <p>한동대학교 입학사정관팀</p>
                    <p>054) 260-1083~6</p>
                </div>
            </div>
            
        </div>
    );
  }
}

export default Footer;