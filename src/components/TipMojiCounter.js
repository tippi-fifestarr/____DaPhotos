import React from 'react';
import { GithubCounter } from '@charkour/react-reactions';

const TipMojiCounter = () => {
  return <GithubCounter counters={[
    {
      emoji: '🗡️😶‍🌫️🧼',
      by: 'Kill_it!',
    },
    {
      emoji:'💗',
      by:'CharlieDay',
    },
    {
      emoji:'🤣',
      by:"tippi-fifestarr",
    },
    {
      emoji:'🌶️',
      by:'sexy+hotspot',
    },
    {
      emoji:'📚',
      by:'rarebook01',
    },
  ]}
  user='tippi' />;
};

export default TipMojiCounter