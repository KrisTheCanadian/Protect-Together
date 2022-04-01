import React, { useState, useEffect } from 'react';

import ProtectTogether from '../../static/style/images/talktodoctor.svg';
import Monitor from '../../static/style/images/Monitor.svg';
import Statistics from '../../static/style/images/Statistics.svg';
import Blob from '../../static/style/images/blob1.svg';
import Blob2 from '../../static/style/images/blob2.svg';
import Blob3 from '../../static/style/images/blob3.svg';
import LoginPanel from './LoginPanel';

const blobs = [Blob, Blob2, Blob3];
const sentences = ['Connect with a Doctor from', 'Keep Up with the Latest Covid-19', 'Monitor and Update Your'];
const boldWords = ['Anywhere.', 'Statistics.', 'Symptoms.'];
const illustrations = [ProtectTogether, Statistics, Monitor];

export default function PanelSwapper(props: any) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentIndex === sentences.length - 1) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }, 15000);
    return () => clearInterval(intervalId);
  }, [currentIndex]);

  return (
    <LoginPanel
      verySmallSize={props.panelVerySmallSize}
      smallSize={props.panelSmallSize}
      medSize={props.panelMedSize}
      blob={blobs[currentIndex]}
      sentence={sentences[currentIndex]}
      boldWord={boldWords[currentIndex]}
      illustration={illustrations[currentIndex]}
    />
  );
};
