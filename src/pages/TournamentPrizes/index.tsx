import React from 'react';
import Page from '../../components/Page';

const TournamentPrizes: React.FC = () => {
  return (
    <Page>
      <iframe
        style={{ width: '100%', height: '100%' }}
        src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQN1y-LJ88aLiEZDpKaSMA9KWIwM7uifaMmB6TRWapM3WkV0BxlQhNmjigHlmk_NzW6Ngg9qLeaCEXT/pubhtml?widget=true&amp;headers=false"
      ></iframe>
    </Page>
  );
};

export default TournamentPrizes;
