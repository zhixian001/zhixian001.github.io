import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { SvgIcon } from "@material-ui/core";
import Timeline from '@material-ui/lab/Timeline';
import CodeIcon from '@material-ui/icons/Code';


import SchoolIcon from '@material-ui/icons/School';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import HistoryLineItem from './HistoryLineItem';

import MojitokIcon from './res/MojitokIcon';

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
            key={d.date}
          >
            {d.icon}
          </HistoryLineItem>
        ))}     
      </Timeline>
    </Grow>
  );
}
