import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import BugReportIcon from '@mui/icons-material/BugReport';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { ExpandableListItem } from './ExpandableList';

export const todoItems: ExpandableListItem[] = [{
  Icon: PublishedWithChangesIcon,
  primaryText: 'Retrieve and chart token to token pairs',
  secondaryText: 'Currently only have ergo to token pairs'
},
{
  Icon: AutoAwesomeIcon,
  primaryText: 'Add liquidity pool valuation to the address analysis',
  secondaryText: 'Currently have to click through ErgoDEX liquidity withdrawal to see your position value'
},
{
  Icon: PublishedWithChangesIcon,
  primaryText: 'Add links to ErgoDEX as well as ErgoPad',
  secondaryText: 'Being able to go directly to a pool, swap, or stake screen from links on this UI would be good'
},
{
  Icon: BugReportIcon,
  primaryText: 'Correct the issue with pool charting',
  secondaryText: 'ErgoPad and SigUSD have some values for Ergo amount in pool that are showing up as blank and charting strange'
},
{
  Icon: BugReportIcon,
  primaryText: 'Reduce times the full data is iterated to improve performance',
  secondaryText: 'Currently the entire dataset is iterated multiple times every time an update is needed, simple refactoring can change this'
},
{
  Icon: BugReportIcon,
  primaryText: 'Clean up and organize files',
  secondaryText: 'Components should go in a components folder, etc, general organization'
}];