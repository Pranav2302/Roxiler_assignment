import React from 'react';
import { Button, Typography, Card, CardContent } from '@mui/material';

function TestComponent() {
  return (
    <Card sx={{ maxWidth: 345, margin: 2 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          MUI Test Component
        </Typography>
        <Typography variant="body2" color="text.secondary">
          checking checking done 
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }}>
          Test Button
        </Button>
      </CardContent>
    </Card>
  );
}

export default TestComponent;