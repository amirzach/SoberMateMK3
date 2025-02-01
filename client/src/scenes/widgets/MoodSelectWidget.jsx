import React from 'react';
import { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import WidgetWrapper from "components/WidgetWrapper";
import { setMood as setMoodState } from "state";

const MoodSelectWidget = ({ userId, currentMood = "neutral" }) => {
  const [localMood, setLocalMood] = useState(currentMood);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);

  const moods = {
    happy: "😊",
    excited: "🤩",
    neutral: "😐",
    sad: "😢",
    angry: "😠"
  };

  const handleMoodChange = async (newMood) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}/mood`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ mood: newMood })
      });

      if (response.ok) {
        setLocalMood(newMood);
        dispatch(setMoodState(newMood));
      }
    } catch (error) {
      console.error('Error updating mood:', error);
    }
  };

  return (
    <WidgetWrapper>
      <Typography
        variant="h6"
        sx={{
          color: (theme) => theme.palette.neutral.dark,
          marginBottom: "1rem"
        }}
      >
        How are you feeling today?
      </Typography>
      
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {Object.entries(moods).map(([moodKey, emoji]) => (
          <IconButton
            key={moodKey}
            onClick={() => handleMoodChange(moodKey)}
            sx={{
              "&:hover": {
                backgroundColor: (theme) => theme.palette.neutral.light,
              },
              backgroundColor: localMood === moodKey ? 
                (theme) => theme.palette.primary.light : 
                "transparent",
              padding: "0.5rem",
              borderRadius: "50%"
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>{emoji}</span>
          </IconButton>
        ))}
      </Box>
      
      <Typography
        sx={{
          color: (theme) => theme.palette.neutral.medium,
          marginTop: "1rem",
          textAlign: "center"
        }}
      >
        Current mood: {moods[localMood]}
      </Typography>
    </WidgetWrapper>
  );
};

export default MoodSelectWidget;