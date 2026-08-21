import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { SvgIcon } from "@material-ui/core";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import CodeIcon from '@material-ui/icons/Code';


import SchoolIcon from '@material-ui/icons/School';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import HistoryLineItem from './HistoryLineItem';

import MojitokIcon from './res/MojitokIcon';
import TossIcon from './res/TossIcon';

import Grow from '@material-ui/core/Grow';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '6px 16px',
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

function iconTypeParser(iconType) {
  switch (iconType) {
    case 'study':
      return (<SchoolIcon />);
    case 'mojitok':
      return (<MojitokIcon />);
    case 'toss':
      return (<TossIcon />);
    case 'code':
      return (<CodeIcon />);
    
    default:
      return (<StarBorderIcon />);
  }
}

export default function HistoryLine() {
  const classes = useStyles();

  const [contentList, setContentList] = useState([]);

  useEffect(async () => {
    const contentListResponse = await (await fetch('/assets/contents/index.json')).json();

    const contentData = contentListResponse.map(d => {
      return {
        date: d.date,
        icon: iconTypeParser(d.iconType),
        dotStyle: d.iconType === 'toss' ? { backgroundColor: '#ffffff', border: '1.5px solid #e8f0fe', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)' } : undefined,
        markdown: {
          markdownUrl: `/assets/contents/${d.filename}.md`
        }
      };
    });

    setContentList(contentData);
  }, []);

  return (
    <Grow
      in={true}
    >
      <Timeline align="alternate">
        {contentList.map(d => (
          <HistoryLineItem
            markdown={d.markdown}
            historyDate={d.date}
            dotStyle={d.dotStyle}
            key={d.date}
          >
            {d.icon}
          </HistoryLineItem>
        ))}
        <TimelineItem style={{ minHeight: 28 }}>
          <TimelineOppositeContent style={{ flex: 1, padding: 0 }} />
          <TimelineSeparator>
            <TimelineDot
              style={{
                backgroundColor: '#bdbdbd',
                width: 8,
                height: 8,
                margin: '0 auto',
                padding: 0,
                boxShadow: 'none',
              }}
            />
          </TimelineSeparator>
          <TimelineContent style={{ flex: 1, padding: 0 }} />
        </TimelineItem>
      </Timeline>
    </Grow>
  );
}
