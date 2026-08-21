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
    backgroundColor: '#ffffff',
    color: '#0a66c2 !important',
    border: '1.5px solid #0a66c2 !important',
    borderRadius: '24px',
    padding: '8px 24px',
    fontSize: '0.95rem',
    fontWeight: 600,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    '&:hover': {
      backgroundColor: '#0a66c2 !important',
      color: '#ffffff !important',
      '& $icon': {
        color: '#ffffff',
      },
    },
  },
  icon: {
    color: '#0a66c2',
  },
}));

export default function Profile() {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.root}>
      <Button
        variant="outlined"
        startIcon={<LinkedInIcon className={classes.icon} />}
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
