import { Typography, Grid, SvgIcon, Divider, Card, List, ListItemButton, ListItemIcon, ListItemText, Button, Box, Container, CircularProgress } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft as ArrowIcon, DollarSign as DollarIcon, Plus as PlusIcon, Divide } from 'react-feather';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import TransactionCard from '../../Components/Profile/TransactionCard';
import { useSelector } from 'react-redux';
import { apiWrapper } from '../../API';
import { retrieveOwnTransactions } from '../../API/walletApi';
import InContainerLoading from '../../Components/InContainerLoading';
import { i } from 'mathjs';
import InfiniteScroll from 'react-infinite-scroll-component';

// const transactions = [{
//   amount: 50,
//   dateCompleted: new Date(),
//   dateCreated: new Date(),
//   id: 5050, 
//   paymentStatus: 'COMPLETED'
// }, {
//   amount: -20,
//   dateCreated: new Date(),
//   id: 5051, 
//   paymentStatus: 'COMPLETED'
// },
// {
//   amount: 10,
//   dateCompleted: new Date(),
//   dateCreated: new Date(),
//   id: 5052, 
//   paymentStatus: 'DECLINED'
// }]

const Transactions = () => {
  const history = useNavigate();
  const goBack = () => {
    history(-1);
  }

  function compare(a,b) {
    let ax = a.dateCreated;
    let bx = b.dateCreated;
    if(a.dateCompleted) {
      ax = a.dateCompleted;
    }

    if(b.dateCompleted) {
      bx = b.dateCompleted;
    }

    if(ax < bx) {
      return -1;
    } else {
      return 1;
    }


  }

  const[isLoading,setIsLoading] = React.useState(false);
  const[transactions,setTransactions] = React.useState([]);
  const[page,setPage] = React.useState(0);
  const[hasMore, setHasMore] = React.useState(true);
  const[isLoadMore, setIsLoadMore]  = React.useState(false);
   
  const currUserData = useSelector((state) => state.currUserData);
  const infRef = React.useRef(null);

  React.useEffect(() => {
    getTransactions();
  },[])

  async function getTransactions() {
    setIsLoading(true);
    const res = await apiWrapper(retrieveOwnTransactions(),'',true);
    if(res) {
      console.log("TRANSACTIONS: " + JSON.stringify(res));
      setTransactions(res.data);
      setPage((pg) => pg+1);
    }
    const res2 = await apiWrapper()
    setIsLoading(false);
  }

  async function loadMore() {
    console.log('loadingMore, pg:', page);
    if(!isLoadMore && hasMore) {
      setIsLoadMore(true);
      const res = await apiWrapper(retrieveOwnTransactions(page),'',true); 
      if(res) {
        console.log("TRANSACTIONS: " + JSON.stringify(res));
        setTransactions(transactions.concat(res.data));
        if(res.data.length == 0) setHasMore(false);
        setPage((pg) => pg+1);
      }
      setIsLoadMore(false);
    }
    return;

  }

  return (
    <Container sx={{height: '100%', overflow:'scroll'}} id='transactions-container'>
      {!isLoading ? <>
      <Box>
        <SvgIcon
          fontSize="medium"
          color="action"
          onClick={goBack}
          sx={{cursor:'pointer'}}
        >
          <ArrowIcon />
        </SvgIcon>
      </Box>
      <Box sx={{mt: 2}}>
        <Typography variant="h5" fontWeight={550} sx={{ marginLeft: 1 }}>
          Transactions
        </Typography>
        <Divider orientation="row" />
      </Box>
      {transactions?.length > 0 ?
        <InfiniteScroll
        dataLength={transactions.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<Box sx={{display:'flex',flexGrow:1, justifyContent:'center', alignItems:'center'}}><CircularProgress/></Box>}
        scrollableTarget='transactions-container'
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
      {transactions.map((val,idx) => (
        <TransactionCard transaction={val} key = {idx} />
      ))}</InfiniteScroll> : 
      <Box sx = {{height : '100%', display : 'flex', flexGrow : 1, justifyContent : 'center', alignItems : 'center'}}>
        <Button
          variant="contained"
          disabled = {true}
          sx={{":disabled" : {color : 'white', backgroundColor : 'secondary.main'}}}
          >
            No transactions
        </Button>
      </Box>}
      </>
    : <InContainerLoading/> }
    </Container>
  );
};

export default Transactions;