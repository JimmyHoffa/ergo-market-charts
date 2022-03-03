import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import BugReportIcon from '@mui/icons-material/BugReport';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { ExpandableListItem } from './ExpandableList';

export const changeLogItems: ExpandableListItem[] = [{
    Icon: AutoAwesomeIcon,
    primaryText: 'Turned address analysis into a stacked area chart',
    secondaryText: 'Mar 3, 2022'
  },
  {
    Icon: PublishedWithChangesIcon,
    primaryText: 'Add erg to address analysis',
    secondaryText: 'Mar 3, 2022'
  },
  {
  Icon: BugReportIcon,
  primaryText: 'Fixed bug in realtime updating not starting by default',
  secondaryText: 'Mar 2, 2022'
},
{
  Icon: BugReportIcon,
  primaryText: 'Fixed issue with some token pools having missing data points',
  secondaryText: 'Mar 1, 2022'
},
{
  Icon: PublishedWithChangesIcon,
  primaryText: 'Added todo list',
  secondaryText: 'Mar 1, 2022'
},
{
  Icon: PublishedWithChangesIcon,
  primaryText: 'Improved performance significantly',
  secondaryText: 'Mar 1, 2022'
},
{
  Icon: PublishedWithChangesIcon,
  primaryText: 'Added cache breaking to historical data on changelog updates',
  secondaryText: 'Mar 1, 2022'
},
{
  Icon: PublishedWithChangesIcon,
  primaryText: 'Changed live update interval to every 10 minutes',
  secondaryText: 'Mar 1, 2022'
},
{
  Icon: PublishedWithChangesIcon,
  primaryText: 'Refactored changelog to add todo list also',
  secondaryText: 'Mar 1, 2022'
},
{
  Icon: PublishedWithChangesIcon,
  primaryText: 'Filtered out bad test pool boxes from data which impacted ErgoPad and SigUSD charts',
  secondaryText: 'Feb 28, 2022'
},
{
  Icon: PublishedWithChangesIcon,
  primaryText: 'Updated all historical data to current',
  secondaryText: 'Feb 28, 2022'
},
{
  Icon: AutoAwesomeIcon,
  primaryText: 'Adding loading spinner for address analysis and initial data',
  secondaryText: 'Feb 24, 2022'
},
{
  Icon: PublishedWithChangesIcon,
  primaryText: 'Forced initial data load of latest data items',
  secondaryText: 'Feb 24, 2022'
},
{
  Icon: PublishedWithChangesIcon,
  primaryText: 'Removed historical data from bundle, requesting it with axios to speed initial load',
  secondaryText: 'Feb 24, 2022'
},
{
  Icon: PublishedWithChangesIcon,
  primaryText: 'Formatted numbers with commas and reduced decimals',
  secondaryText: 'Feb 22, 2022'
},
{
  Icon: PublishedWithChangesIcon,
  primaryText: 'Updated seed data to current full set',
  secondaryText: 'Feb 22, 2022'
},
{
  Icon: PublishedWithChangesIcon,
  primaryText: 'Removed xyzpad token as it was noise',
  secondaryText: 'Feb 22, 2022'
},
{
  Icon: AutoAwesomeIcon,
  primaryText: 'Added this changelog',
  secondaryText: 'Feb 22, 2022'
},
{
  Icon: BugReportIcon,
  primaryText: 'Fixed the address analysis',
  secondaryText: 'Feb 22, 2022'
},
{
  Icon: AutoAwesomeIcon,
  primaryText: 'Added tip address',
  secondaryText: 'Feb 21, 2022'
},
{
  Icon: PublishedWithChangesIcon,
  primaryText: 'Reduced data updates to 2 minute interval, fixed local data storage bug',
  secondaryText: 'Feb 20, 2022'
},
{
  Icon: AutoAwesomeIcon,
  primaryText: 'Added zoom controls',
  secondaryText: 'Feb 18, 2022'
},
{
  Icon: AutoAwesomeIcon,
  primaryText: 'Added all historical price data from explorer as seed',
  secondaryText: 'Feb 18, 2022'
},
{
  Icon: PublishedWithChangesIcon,
  primaryText: 'Added selector to the top to choose tokens to see',
  secondaryText: 'Feb 17, 2022'
},
{
  Icon: AutoAwesomeIcon,
  primaryText: 'Storing data in browser local storage',
  secondaryText: 'Feb 17, 2022'
}];