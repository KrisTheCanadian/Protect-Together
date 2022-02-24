import React from 'react';
import { Button, Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

const styles = {
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default function Question1Layout(props: any) {
  const [ansYes, setAnsYes] = React.useState(false);
  const [buttonClicked, setButtonClicked] = React.useState(false);
  const [value, setValue] = React.useState('false');
  const handleClickYes = () => {
    setAnsYes(true);
    setButtonClicked(true);
    setValue('response0');
  };

  const handleClickNo = () => {
    setAnsYes(false);
    setButtonClicked(true);
    setValue('2');
  };

  return (
    <div style={{ display: 'flex' }}>
      <Box
        minHeight="95vh"
        width="100%"
        flexDirection="column"
        sx={{ flexGrow: 1 }}
        style={styles.centered}
      >
        <Container
          sx={{
            marginLeft: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Button
            variant="contained"
            sx={{
              borderRadius: 8,
              fontSize: '17px',
              paddingBottom: '3px',
              paddingTop: '3px',
              minHeight: 0,
              minWidth: 0,
            }}
          >
            Question 1
          </Button>
          <Typography variant="h4" sx={{ marginTop: 1 }}>
            Have you experienced any of the following symptoms?
          </Typography>
          <List sx={{ marginBottom: 1 }}>
            <ListItem>
              <ListItemText>
                <Typography variant="subtitle1" sx={{ color: '#202020' }}>
                  <CircleIcon sx={{ fontSize: 'small' }} />
                  {' '}
                  Severe difficulty breathing (struggling to breathe or speaking in single words)
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Typography variant="subtitle1" sx={{ color: '#202020' }}>
                  <CircleIcon sx={{ fontSize: 'small' }} />
                  {' '}
                  Severe chest pain (constant tightness or crushing sensation)
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Typography variant="subtitle1" sx={{ color: '#202020' }}>
                  <CircleIcon sx={{ fontSize: 'small' }} />
                  {' '}
                  Losing consciousness
                </Typography>
              </ListItemText>
            </ListItem>
          </List>
          <Button
            onClick={handleClickYes}
            variant={ansYes && buttonClicked ? 'contained' : 'outlined'}
            sx={{ marginBottom: '1rem' }}
          >
            Yes
          </Button>
          <Button
            onClick={handleClickNo}
            variant={!ansYes && buttonClicked ? 'contained' : 'outlined'}
            sx={{ marginBottom: '1rem' }}
          >
            No
          </Button>
        </Container>
        <Container
          sx={{
            marginTop: '2rem',
          }}
          style={styles.centered}
        >
          <Button onClick={() => props.changeStatus(value)} type="submit" variant="contained" color="primary">
            Continue
          </Button>
        </Container>
      </Box>
    </div>
  );
}
