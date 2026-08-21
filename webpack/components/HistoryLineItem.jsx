import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import MarkdownContent from './MarkdownContent';


/**
 * 
 * @typedef {{
 *  markdown: import('./MarkdownContent').MarkdownContentProps,
 *  historyDate?: string
 *  children: React.ComponentElement
 * }} HistoryLineItemProps
 */

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '16px 20px',
    textAlign: 'left',
    '& h4': {
      margin: '0 0 4px 0 !important',
      fontSize: '1.05rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    '& p': {
      margin: '0 !important',
      fontSize: '0.9rem',
      color: theme.palette.text.secondary,
      lineHeight: 1.4,
    },
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

/**
 * 
 * @param {HistoryLineItemProps} props 
 */
export default function HistoryLineItem(props) {
  const classes = useStyles();

  return (
    <TimelineItem>
      {
        props.historyDate ? (
          <TimelineOppositeContent>
            <Typography variant="body2" color="textSecondary">
              {props.historyDate}
            </Typography>
          </TimelineOppositeContent>
        ) : (
          <div className='hidden'></div>
        )
      }
      <TimelineSeparator>
        <TimelineDot
          color="primary"
          style={props.dotStyle}
        >
          {props.children}
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Paper elevation={3} className={classes.paper}>
          <MarkdownContent
            {...props.markdown}
          />
        </Paper>
      </TimelineContent>
    </TimelineItem>
  );
}