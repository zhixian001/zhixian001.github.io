import React from 'react';
import Icon from "@material-ui/core/Icon";

export default function TossIcon() {
  return (
    <Icon>
      <img 
        src='/assets/images/toss.png'
        style={{
          verticalAlign: 'top',
          objectFit: 'contain'
        }}
      />
    </Icon>
  );
}
