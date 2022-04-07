import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Divider,
} from '@mui/material';
import theme from '../../../../static/style/theme';

const listHeaderStyle = {
  backgroundColor: theme.palette.secondary.main,
  color: 'black',
  fontWeight: 'bold',
  marginTop: '16px',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
};

const listStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
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
