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
    padding: '6px 16px',
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
          // variant="outlined"
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