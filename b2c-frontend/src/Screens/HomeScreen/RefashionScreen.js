import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  TextField,
  SvgIcon,
  Chip,
  ImageList,
  ImageListItem,
  Menu,
  MenuItem,
  ImageListItemBar
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { PlusCircle as PlusIcon, ArrowLeft as ArrowIcon } from 'react-feather';
import { useNavigate } from 'react-router';

const attachments = ['https://media.lovebonito.com/media/catalog/product/l/n/ln0716-031_qzkzn8hacyivry77.jpg?width=960&height=1344',
  'https://media.lovebonito.com/media/catalog/product/l/n/ln0736-031-1_oohpuoyzjegiups3.jpg?width=960&height=1344',
  'https://media.lovebonito.com/media/catalog/product/t/h/th1722-1_8n7xckxhiywbgiai.jpg?width=800&height=1120',
  'https://media.lovebonito.com/media/catalog/product/l/n/ln0979-2_cdovujh2oj0hed6n.jpg?width=800&height=1120',
  'https://media.lovebonito.com/media/catalog/product/l/n/ln0716-031_qzkzn8hacyivry77.jpg?width=960&height=1344',
  'https://media.lovebonito.com/media/catalog/product/l/n/ln0736-031-1_oohpuoyzjegiups3.jpg?width=960&height=1344',
  'https://media.lovebonito.com/media/catalog/product/t/h/th1722-1_8n7xckxhiywbgiai.jpg?width=800&height=1120',
  'https://media.lovebonito.com/media/catalog/product/l/n/ln0979-2_cdovujh2oj0hed6n.jpg?width=800&height=1120']


const RefashionScreen = () => {
  const [searchValue, setSearchValue] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    setSearchValue([])
  }, []);

  const list = ["hello", "bye"];

  const itemData = ["1", "2", "3", "4", "5", "6", "7", "8"];

  const openMenu = (event) => {
    setMenuOpen(!menuOpen);
    setAnchorEl(event.currentTarget);
  };

  const handleDelete = (item) => {
    const newArr = Array.from(searchValue);
    const index = newArr.indexOf(item);
    newArr.splice(index, 1);
    setSearchValue(newArr);
    alert(searchValue);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const processClick = (e) => {
    console.log('procesed');
    const newArr = searchValue;
    newArr.push(e.target.title);
    setSearchValue(newArr);
  };

  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Alt.Native</title>
      </Helmet>
      <Box
        sx={{
          minHeight: '100%',
          px: 3,
          py: 3,
          marginBottom: 7,
        }}
      >
        <Container maxWidth={false}>
          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
            >
              <SvgIcon
                fontSize="medium"
                color="action"
                sx={{ position: 'absolute', float: 'left', top: 30, cursor: 'pointer' }}
                onClick={() => navigate(-1)}
              >
                <ArrowIcon />
              </SvgIcon>
            </Grid>
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
              style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              <div className='homepage_title' style={{ fontWeight: "bold", alignSelf: "center" }}>Refashion ideas</div>
            </Grid>
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
              style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              {Array.from(searchValue).map((item) => (
                <Chip
                  label={item}
                  key={item}
                  onDelete={() => handleDelete(item)}
                  style={{
                    background: "#FB7A56",
                    fontWeight: "bold",
                    color: "white",
                    padding: "2.5vh 1.5vw",
                    margin: "0 0.3em",
                    borderRadius: "3vh"
                  }}
                >
                </Chip>
              ))}
              <Box style={{ cursor: 'pointer' }} onClick={(e) => openMenu(e)}>
                <SvgIcon
                  fontSize="large"
                  color="action"
                >
                  <PlusIcon />
                </SvgIcon>
                <Menu
                  id="basic-menu"
                  open={menuOpen}
                  anchorEl={anchorEl}
                  keepMounted
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem title="Denim" onClick={(e) => processClick(e)}>
                    Denim
                  </MenuItem>
                  <MenuItem title="Dress" onClick={(e) => processClick(e)}>
                    Dress
                  </MenuItem>
                  <MenuItem onClick={(e) => e.preventDefault()} >
                    <TextField
                      placeholder="Enter Keywords.."
                      onChange={(event) => { setSearchValue(event.target.value); }}
                    />
                  </MenuItem>
                </Menu>
              </Box>
            </Grid>
            <Grid item xs={12} style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
              {attachments !== null && attachments.length > 0 &&
                <ImageList cols={2}>
                  {Array.from(attachments).map((img, i) => (
                    <Link to={`/orderDetails/${i}`}>
                      <ImageListItem key={i} style={{ width: 130, height: 130, overflow: 'hidden' }} >
                        <img src={img} loading="lazy" style={{ cursor: 'pointer' }} />
                        <ImageListItemBar
                          title={'White dress'}
                          subtitle={'Refashioner A'}
                          sx={{ background: 'rgba(180, 180, 180, 0.5)', height: '34%' }}
                        />
                      </ImageListItem>
                    </Link>
                  ))}
                </ImageList>
              }
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default RefashionScreen;