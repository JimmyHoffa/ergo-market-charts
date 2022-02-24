import * as React from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
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
            <ListItemIcon sx={{ minWidth: '30px' }}><AutoAwesomeIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Adding loading spinner for address analysis and initial data" secondary="Feb 24, 2022" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}><PublishedWithChangesIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Forced initial data load of latest data items" secondary="Feb 24, 2022" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}><PublishedWithChangesIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Removed historical data from bundle, requesting it with axios to speed initial load" secondary="Feb 24, 2022" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}><PublishedWithChangesIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Formatted numbers with commas and reduced decimals" secondary="Feb 22, 2022" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}><PublishedWithChangesIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Updated seed data to current full set" secondary="Feb 22, 2022" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}><PublishedWithChangesIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Removed xyzpad token as it was noise" secondary="Feb 22, 2022" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}><AutoAwesomeIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Added this changelog" secondary="Feb 22, 2022" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}><BugReportIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Fixed the address analysis" secondary="Feb 22, 2022" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}><AutoAwesomeIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Added tip address" secondary="Feb 21, 2022" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}><PublishedWithChangesIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Reduced data updates to 2 minute interval, fixed local data storage bug" secondary="Feb 20, 2022" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}><AutoAwesomeIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Added zoom controls" secondary="Feb 18, 2022" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}><AutoAwesomeIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Added all historical price data from explorer as seed" secondary="Feb 18, 2022" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}><PublishedWithChangesIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Added selector to the top to choose tokens to see" secondary="Feb 17, 2022" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}><AutoAwesomeIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Storing data in browser local storage" secondary="Feb 17, 2022" />
          </ListItem>
        </List>
      </Expandable></Box>
      </Card>
    );
}