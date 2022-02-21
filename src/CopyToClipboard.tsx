import * as React from "react";
import Tooltip from "@mui/material/Tooltip";
import CopyAllIcon from '@mui/icons-material/CopyAll'
import { Typography } from "@mui/material";

export const CopyToClipboard = (props: any) => {
    const { whatToCopy } = props;
    const [showTooltip, setShowTooltip] = React.useState<boolean>(false);
    const onCopy = () => {
      navigator.clipboard.writeText(whatToCopy);
      setShowTooltip(true);
    };

    const handleOnTooltipClose = () => {
      setShowTooltip(false);
    };

    return  (
        <Tooltip
          open={showTooltip}
          title={`Copied ${whatToCopy}`}
          leaveDelay={1500}
          onClose={handleOnTooltipClose}
          {...props.TooltipProps || {}}
        >
          <Typography onClick={onCopy} sx={{ cursor: 'pointer' }}>
            {/* {this.props.children({ copy: this.onCopy }) as React.ReactElement<any>} */}
            {props.children}
            <CopyAllIcon onClick={ onCopy } sx={{ height: '15', width: '15' }} />
          </Typography>
        </Tooltip>
      );
}
