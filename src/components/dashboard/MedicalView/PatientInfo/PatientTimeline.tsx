import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import { Timestamp } from 'firebase/firestore';

type Events = {
  date: Timestamp,
  eventsList: string[],
};

type EventsProps = {
  events: Events[] | undefined,
}

function PatientTimeline({ events }: EventsProps) {
  if (events !== undefined && events.length > 0) {
    return (
      <Paper
        elevation={20}
        sx={{
          bgcolor: 'white',
          padding: '20px',
          minWidth: '200px',
          overflowY: 'auto',
          maxHeight: '80vh',
        }}
      >
        <Timeline>
          {events?.map((event: Events) => (
            <TimelineItem key={event.date.toString()}>
              <TimelineOppositeContent color="text.secondary">
                { format(event.date.toDate(), 'yyyy-LL-dd KK:mm:ss a')}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent
                sx={{ paddingTop: 0, paddingBottom: 2 }}
              >
                <List
                  dense
                  sx={{ marginTop: 0, p: 0 }}
                >
                  { event.eventsList.map((item: string) => (
                    <ListItem
                      dense
                      key={item}
                    >
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Paper>
    );
  }
  return (
    <Paper
      elevation={20}
      sx={{
        bgcolor: 'white',
        padding: '20px',
        minWidth: '200px',
        overflowY: 'auto',
        maxHeight: '80vh',
      }}
    >
      <Typography variant="h6" sx={{ textAlign: 'center' }}>No Events</Typography>
    </Paper>
  );
}

export default PatientTimeline;
