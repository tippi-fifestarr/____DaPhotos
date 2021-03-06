import React from 'react';
import { GithubCounter } from '@charkour/react-reactions';

const TipMojiCounter = () => {
  return <GithubCounter counters={[
    {
      emoji: 'π‘οΈπΆβπ«οΈπ§Ό',
      by: 'Kill_it!',
    },
    {
      emoji:'π',
      by:'CharlieDay',
    },
    {
      emoji:'π€£',
      by:"tippi-fifestarr",
    },
    {
      emoji:'πΆοΈ',
      by:'sexy+hotspot',
    },
    {
      emoji:'π',
      by:'rarebook01',
    },
  ]}
  user='tippi' />;
};

export default TipMojiCounter