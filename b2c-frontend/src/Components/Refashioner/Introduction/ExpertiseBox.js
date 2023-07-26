import { Card, Avatar, CardContent, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

const ExpertiseBox = ({ name, selected = false }) => {
  return (
    <Card>
      <CardContent sx={{minHeight: '120px', backgroundColor: `${selected ? 'primary.main' : 'white'}`, display : 'flex', flexDirection : 'column', alignItems : 'center', justifyContent : 'center', ':last-child' : {paddingBottom : 2}}}>
        <Avatar />
        <Typography variant='caption' sx={{marginTop : 1}} textAlign='center'>
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ExpertiseBox;