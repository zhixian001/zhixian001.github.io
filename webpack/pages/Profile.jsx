import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import LinkedInIcon from '@material-ui/icons/LinkedIn';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4, 2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkButton: {
    textTransform: 'none',
    backgroundColor: '#0a66c2',
    color: '#ffffff',
    padding: '8px 24px',
    fontSize: '0.95rem',
    fontWeight: 500,
    '&:hover': {
      backgroundColor: '#004182',
    },
  },
}));

export default function Profile() {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.root}>
      <Button
        variant="contained"
        startIcon={<LinkedInIcon />}
        className={classes.linkButton}
        href="https://www.linkedin.com/in/제헌-염-8097151a3"
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn Profile
      </Button>
    </Paper>
  );
}
