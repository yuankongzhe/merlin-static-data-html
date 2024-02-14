
import React, { useEffect, useState } from 'react';
import styles from './CircularProgressBar.module.css'; // If using CSS modules

const CircularProgressBar = ({ percent }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const [offset, setOffset] = useState(circumference);

    useEffect(() => {
        const progressOffset = circumference - (percent / 100) * circumference;
        setOffset(progressOffset);
    }, [percent, circumference]);

    return (

            <svg className={styles.svg} viewBox="0 0 160 160">
                <circle
                    className={styles.circle}
                    cx="80"
                    cy="80"
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
                <text
                    x="80"
                    y="80"
                    fill="#6b778c"
                    className={styles.text}
                >
                    {percent}%
                </text>
            </svg>

    );
};

export default CircularProgressBar;