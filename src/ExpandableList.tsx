import * as React from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { Expandable } from './ExpandMore';

export interface ExpandableListItem {
  Icon: any;
  primaryText: string;
  secondaryText: string;
}

export interface ExpandableListProps {
  header: string;
  items: ExpandableListItem[];
}

export const ExpandableList = (props: ExpandableListProps) => {
  const { header, items} = props;
    return (
      <Card sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column'}} variant="outlined">
        <ListSubheader>{ header }</ListSubheader>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', minWidth: '400px', flexDirection: 'row' }}>
          <Expandable initiallyExpanded={false}>
            <List dense={true} sx={{
              width: '100%',
              maxWidth: 360,
              position: 'relative',
              overflow: 'auto',
              maxHeight: 300,
              '& ul': { padding: 0 },
              '& li': { padding: 0 },
            }}>
              {items.map(({ Icon, primaryText, secondaryText}, itemIdx) => (
                <ListItem key={ itemIdx }>
                  <ListItemIcon sx={{ minWidth: '30px' }}><Icon fontSize="small" /></ListItemIcon>
                  <ListItemText primary={primaryText} secondary={secondaryText} />
                </ListItem>
              ))}
            </List>
          </Expandable>
        </Box>
      </Card>
    );
}