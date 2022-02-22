import * as React from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import BugReportIcon from '@mui/icons-material/BugReport';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import { Expandable } from './ExpandMore';

export const Changelog = (props: any) => {
    return (
      <Card sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column'}} variant="outlined">
      <ListSubheader>Changelog:</ListSubheader>
      <Box sx={{ display: 'flex', alignItems: 'flex-start'}}>
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
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}><PublishedWithChangesIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Removed xyzpad token as it was noise" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}><AutoAwesomeIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Added changelog" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}><BugReportIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Fixed the address analysis" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}><AutoAwesomeIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Added tip address" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}><PublishedWithChangesIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Reduced data updates to 2 minute interval, fixed local data storage bug" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}><AutoAwesomeIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Added zoom controls" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}><PublishedWithChangesIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Added all historical price data from explorer as seed" />
          </ListItem>
        </List>
      </Expandable></Box>
      </Card>
    );
}