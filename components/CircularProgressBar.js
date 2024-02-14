
import React, { useEffect, useState } from 'react';
import styles from './CircularProgressBar.module.css'; // If using CSS modules

const CircularProgressBar = ({ percent,circleClass,textClass }) => {
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
                    style={{ stroke: circleClass  }}
                />
                <text
                    x="80"
                    y="80"
                    className={styles.text}
                    style={{ fill: textClass  }}
                >
                    {percent}%
                </text>
            </svg>

    );
};

export default CircularProgressBar;