import * as React from 'react';
import JSONBigInt from 'json-bigint';
import { ExplorerRequestManager } from "ergo-market-lib/dist/ExplorerRequestManager";
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

export const ExpandMore = styled((props: any) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }: any) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const Expandable = (props: any) => {
    const [expanded, setExpanded] = React.useState<boolean>(props.initiallyExpanded || false);
    const handleExpandClick = () => {
        setExpanded(!expanded)
    }
    return (<><ExpandMore
        expand={expanded}
        onClick={handleExpandClick}
        aria-expanded={expanded}
        aria-label="show more"
        variant="contained"
    >
        <ExpandMoreIcon />
    </ExpandMore>
    <Collapse in={expanded} timeout="auto" unmountOnExit>
        { props.children }
    </Collapse></>)
}