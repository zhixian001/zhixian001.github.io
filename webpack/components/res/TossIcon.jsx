import React from 'react';
import Icon from "@material-ui/core/Icon";

export default function TossIcon() {
  return (
    <Icon
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
      }}
    >
      <img 
        src='/assets/images/toss.png'
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </Icon>
  );
}
