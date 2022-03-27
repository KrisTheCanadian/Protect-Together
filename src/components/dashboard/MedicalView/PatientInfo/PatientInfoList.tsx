import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Divider,
} from '@mui/material';

const listHeaderStyle = {
  backgroundColor: '#E6E6E6',
  color: 'black',
  fontWeight: 'bold',
  marginTop: '16px',
};

const listStyle = {
  backgroundColor: 'white',
};

type StringPair = {
  primary: string,
  secondary: string,
};

type ListProps = {
  listTitle: string,
  listItems: StringPair[] | undefined,
};

function PatientInfoList({ listTitle, listItems }: ListProps) {
  return (
    <List
      dense
      sx={listStyle}
      subheader={(
        <ListSubheader
          sx={listHeaderStyle}
        >
          {listTitle}
        </ListSubheader>
              )}
    >
      {listItems?.map((item: StringPair, id) => {
        const elem = [
          <Divider key={0} variant="middle" />,
          <ListItem key={`${item.primary}-${item.secondary}`}>
            <ListItemText primary={item.primary} secondary={item.secondary} />
          </ListItem>,
        ];
        if (id === 0) return (elem[1]);
        return (
          elem
        );
      })}
    </List>
  );
}

export default PatientInfoList;
