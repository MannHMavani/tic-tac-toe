import React, { useState, useEffect } from "react";
import "./Historypage.css";

function HistoryPage() {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/history/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setHistoryData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className="container">
      <h1 className="history-header">History</h1>
      <ol className="history-list">
        {historyData.map((item, index) => (
          <li className="history-item" key={index}>
            <span className="match">Match :</span> {item.player1} vs{" "}
            {item.player2}
            <br />
            <span className="winner">Winner :</span> {item.winner}
            <br />
            <span className="date">Date :</span> {item.date}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default HistoryPage;
