import { Stack, Box, Typography } from '@mui/material';
import React from 'react';
import getPlayerById from '../../utils/getPlayerById';
import getPlayerNameById from '../../utils/getPlayerNameById';
import AvatarPlayer from '../AvatarPlayer';

type MatchFinishedProps = {
  match: Match;
  matchIndex: number;
  tournamentData: TournamentData;
};

const MatchFinished: React.FC<MatchFinishedProps> = ({
  match,
  matchIndex,
  tournamentData,
}) => {
  return (
    <Stack>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', width: 1, alignItems: 'center' }}>
          <Typography variant="h6" color="textPrimary" sx={{ marginRight: 1 }}>
            {matchIndex + 1}.
          </Typography>
          <AvatarPlayer
            player={
              getPlayerById({
                playerId: match.playersIds[0],
                tournamentData,
              }) as Player
            }
            sx={{ marginRight: 1, width: 32, height: 32 }}
          />
          <Typography variant="h6" color="textPrimary">
            {getPlayerNameById({
              playerId: match.playersIds[0],
              tournamentData,
            })}
          </Typography>
        </Box>
        <Box sx={{ width: 1, textAlign: 'center' }}>
          <Typography variant="h6" color="textPrimary">
            {match.playersVirories[0]} X {match.playersVirories[1]}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            width: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Typography variant="h6" color="textPrimary">
            {getPlayerNameById({
              playerId: match.playersIds[1],
              tournamentData,
            })}
          </Typography>
          <AvatarPlayer
            player={
              getPlayerById({
                playerId: match.playersIds[1],
                tournamentData,
              }) as Player
            }
            sx={{ marginLeft: 1, width: 32, height: 32 }}
          />
        </Box>
      </Box>
    </Stack>
  );
};

export default MatchFinished;
