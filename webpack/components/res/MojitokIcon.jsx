import React from 'react';
import Icon from "@material-ui/core/Icon";

export default function MojitokIcon() {
  return (
    <Icon>
      <img 
        src='/assets/images/mojitok.svg'
        style={{
          verticalAlign: 'top',
          objectFit: 'fill'
        }}
      />
    </Icon>
  )
}