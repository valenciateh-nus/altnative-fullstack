import { Button, Grid, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import * as indexApi from '../../API/index'
import InContainerLoading from '../InContainerLoading';
import { useNavigate } from 'react-router-dom';

const MyProjectRequest = () => {
  const [list, setList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    setLoading(true);
    getListings();
  }, [])

  async function getListings() {
    try {
      await indexApi.getRequests().then((arr) => {
        const array = arr.data;
        array.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.dateCreated) - new Date(a.dateCreated);
        })
        setList(array);
      })
    } catch (error) {
      setList([]);
    } finally {
      setLoading(false);
    }
  }

  return (!loading ? (
    <Grid item xs={12} sx={{ display: "flex", flexDirection: 'row' }}>
        {list.length > 0 ? (
          <>
                <Box sx={{ display: "flex", overflowX: 'scroll' }}>
            <ImageList sx={{ overflowX: 'scroll', display: 'flex', ml: 1 }}>
              {Array.from(list).slice(0, 5).map((req) => (
                (req.imageList && Array.from(req.imageList).slice(0, 1).map((val) => (
                  <ImageListItem key={val.url} style={{ maxWidth: 180, minWidth: 180, height: 180, overflow: 'hidden', marginRight: 30 }} onClick={() => navigate(`/request/${req.id}`)}>
                    <img src={val.url} alt={val.url} loading="lazy" style={{ cursor: 'pointer', display: 'flex' }} />
                    <ImageListItemBar
                      subtitle={req.title}
                    />
                  </ImageListItem>
                )))
              ))}
            </ImageList>
            </Box>
          </>
        ) : (
          <Box sx={{ maxHeight: '100%', display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center', mt: 5 }}>
            <Button
              variant="contained"
              disabled={true}
              sx={{ ":disabled": { color: 'white', backgroundColor: 'secondary.main' } }}
            >
              No project requests
            </Button>
          </Box>
        )}
    </Grid>
  ) : (
    <InContainerLoading />
  ));
};

export default MyProjectRequest;