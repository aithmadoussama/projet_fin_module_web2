import { useState, useEffect } from "react";
import "../assets/styles/progresscard.css";

export default function ProgressCard() {
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);

    const handleAction = () => {
        setVisible(true);

        setProgress((prev) => {
            let value = prev + 10;
            if (value > 100) value = 100;
            return value;
        });

        setTimeout(() => {
            setVisible(false);
        }, 2000);
    };

    useEffect(() => {
        window.addEventListener("click", handleAction);
        return () => window.removeEventListener("click", handleAction);
    }, []);

    return (
        <>
            {visible && (
                <div className="progress-card">
                    <h3 className="progress-title">Progression</h3>

                    <div className="progress-bar-container">
                        <div
                            className="progress-bar"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <p className="progress-text">{progress}% complété</p>
                </div>
            )}
        </>
    );
}