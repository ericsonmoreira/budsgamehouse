import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTimer } from "react-timer-hook";
import useSound from "use-sound";
import AlertMP3 from "../../assets/alert.mp3";

type TimerProps = {
  interval: number;
};

const Timer: React.FC<TimerProps> = ({ interval }) => {
  const expiryTimestamp = new Date();

  expiryTimestamp.setMinutes(expiryTimestamp.getMinutes() + interval);

  const [play] = useSound(AlertMP3);

  const onExpire = () => {
    play();
  };

  const { seconds, minutes, isRunning, start, pause, resume, restart } =
    useTimer({ expiryTimestamp, autoStart: false, onExpire });

  const [isPaused, setIsPaused] = useState(false);

  const handleStart = () => {
    setIsPaused(false);
    start();
  };

  const handlePause = () => {
    setIsPaused(true);
    pause();
  };

  const handleResume = () => {
    setIsPaused(false);
    resume();
  };

  const handleRestart = () => {
    const time = new Date();

    time.setMinutes(time.getMinutes() + interval);

    restart(time, false);

    setIsPaused(false);
  };

  return (
    <Box
      sx={({ palette }) => ({
        display: "flex",
        alignItems: "center",
        backgroundColor: palette.secondary.main,
        borderRadius: 50,
        paddingX: 2,
        paddingY: 1,
      })}
    >
      <Tooltip title="Start">
        <span>
          <IconButton
            onClick={handleStart}
            disabled={isRunning || isPaused}
            size="small"
          >
            <PlayArrowIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Pause">
        <span>
          <IconButton size="small" onClick={handlePause} disabled={!isRunning}>
            <PauseIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Resume">
        <span>
          <IconButton size="small" onClick={handleResume} disabled={!isPaused}>
            <PlayCircleFilledIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Restart">
        <span>
          <IconButton size="small" onClick={handleRestart}>
            <RestartAltIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Box sx={{ marginLeft: 2 }}>
        <Typography variant="h5" color="white">
          {minutes.toLocaleString("pt-Br", {
            minimumIntegerDigits: 2,
          })}
          :
          {seconds.toLocaleString("pt-Br", {
            minimumIntegerDigits: 2,
          })}
        </Typography>
      </Box>
    </Box>
  );
};

export default Timer;
