import * as React from 'react';
import { Card, CardContent, CardMedia, ListItemText, SvgIcon, Typography } from '@mui/material';
import imagePlaceholder from '../HomeScreen/emptyImage.jpeg';
import PropTypes from 'prop-types';
import { Clock, DollarSign } from 'react-feather';
import { LocalConvenienceStoreOutlined } from '@mui/icons-material';

export default function RequestCard({ request, image }) {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    setData(request);
    console.log(image);
  }, [request])

  console.log(data);

  return (
    <Card sx={{ width: '100%', background: 'transparent' }}>
      <CardContent>
        <CardMedia
          component="img"
          alt={data.title}
          src={image[0].url}
          // src={imagePlaceholder}
          sx={{ borderRadius: '16px', maxHeight: 350, marginBottom: 2, }}
        />
        {/* <img src={request.imageList[0].url} loading="lazy" style={{ cursor: 'pointer' }} /> */}
        <ListItemText
          primary={data.title}
          primaryTypographyProps={{
            style: {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontWeight: 650
            }
          }}
        />
        <Typography sx={{ overflowWrap: 'break-word', fontSize: '0.8em', marginTop: 1}}>
          <SvgIcon
            fontSize="medium"
            color="action"
            sx={{ color: '#FB7A56', margin: '1px 5px', fontSize: '1.5em' }}
          >
            <DollarSign />
          </SvgIcon>
          SGD {data.price}
        </Typography>
        <Typography sx={{ overflowWrap: 'break-word', fontSize: '0.8em' , marginTop: 0.5 }}>
          <SvgIcon
            fontSize="medium"
            color="action"
            sx={{ color: '#FB7A56', margin: '1px 5px', fontSize: '1.5em' }}
          >
            <Clock />
          </SvgIcon>
          {/* {data.deadline} days */}
          {data.proposedCompletionDate}
        </Typography>
      </CardContent>
    </Card>
  )
}

RequestCard.defaultProps = {
  request: []
};

