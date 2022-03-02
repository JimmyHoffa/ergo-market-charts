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
  Icon: PublishedWithChangesIcon,
  primaryText: 'Clean up and organize files',
  secondaryText: 'Components should go in a components folder, etc, general organization'
},
{
  Icon: PublishedWithChangesIcon,
  primaryText: 'Add github link',
  secondaryText: 'If people want to provide PRs, they are absolutely welcome!'
},
{
  Icon: PublishedWithChangesIcon,
  primaryText: 'Turn address analysis into a stacked area chart',
  secondaryText: 'Makes conversions clearer'
},
{
  Icon: PublishedWithChangesIcon,
  primaryText: 'Add erg to address analysis',
  secondaryText: 'Makes conversions clearer'
},
{
  Icon: PublishedWithChangesIcon,
  primaryText: 'Add transaction export to address analysis',
  secondaryText: 'CSV and or JSON can be useful for people to see price at purchase time from their boxes'
},
{
  Icon: PublishedWithChangesIcon,
  primaryText: 'Code split the bundle',
  secondaryText: 'Bundle is massive just because I haven\'t done any code splitting on it'
}];