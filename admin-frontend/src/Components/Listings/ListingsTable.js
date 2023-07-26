import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { visuallyHidden } from '@mui/utils';
import { toTitleCase } from '../../constants';
import moment from 'moment';
import { InputAdornment, Modal, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CustomButton from '../CustomButton';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useNavigate } from "react-router";

function descendingComparator(a, b, orderBy) {
  if(moment(b[orderBy]).isValid() && !moment(a[orderBy]).isValid()) {
    return 1;
  }
  if(!moment(b[orderBy]).isValid() && moment(a[orderBy]).isValid()) {
    return -1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow >
        {headCells.map((headCell,idx) => (
          <TableCell
            key={headCell.id}
            align={'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {toTitleCase(headCell.label)}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  headCells: PropTypes.array.isRequired,
};

function EnhancedTableToolbar({ numSelected, searchValue, handleOnSearchValueChange, selected, handleRefresh }) {

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <TextField placeholder="Filter by username, title or id"
          variant="outlined"
          fullWidth
          value = {searchValue}
          onChange = {handleOnSearchValueChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                edge="end"
              >
                <SearchIcon color={'secondary'}/>
              </IconButton>
            </InputAdornment>
          }
          size='small'
        />
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  searchValue: PropTypes.string,
  handleOnSearchValueChange: PropTypes.func.isRequired,
  selected: PropTypes.object,
};

function CollapsibleRow({isItemSelected, row, labelId, rowNames, handleClick, collapsibleRowNames}) {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {rowNames.map((name, idx) => 
        idx === 0 ? 
        <TableCell 
          component="th"
          id={labelId}
          scope="row"
          padding="none"
          key={idx}
          
        >
          {name.date ? moment(row[name.id]).format('DD MMM yyyy') : (name.object ? row[name.id][name.objectField] : String(row[name.id]))}
        </TableCell> 
        : <TableCell> {name.date ? moment(row[name.id]).format('DD MMM yyyy') : (name.object ? row[name.id][name.objectField] : String(row[name.id]))}</TableCell>
      )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    {collapsibleRowNames.map((name, idx) => 
                      <TableCell 
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        key={idx}
                      >
                        {name.id}
                      </TableCell> 
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rowNames.map((name, idx) => 
                    idx === 0 ? 
                    <TableCell 
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      key={idx}
                    >
                      {name.date ? moment(row[name.id]).format('DD MMM yyyy') : (name.object ? row[name.id][name.objectField] : String(row[name.id]))}
                    </TableCell> 
                    : <TableCell> {name.date ? moment(row[name.id]).format('DD MMM yyyy') : (name.object ? row[name.id][name.objectField] : String(row[name.id]))}</TableCell>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function NormalRow({isItemSelected, row, labelId, rowNames, handleClick, handleView, index}) {
  return (
    <TableRow
      //hover
      //onClick={(event) => handleClick(event, row.id)}
      tabIndex={-1}
      key={row.id}
      selected={isItemSelected}
    >
      {rowNames.map((name, idx) => 
        idx === 0 ? 
        <TableCell 
          component="th"
          id={labelId}
          scope="row"
          padding="normal"
          key={`${row.id}-${idx}`}

        >
          {name.date ? (moment(row[name.id]).isValid() ? moment(row[name.id]).format('DD MMM yyyy') : '-') : (name.object ? row[name.id][name.objectField] : String(row[name.id]))}
        </TableCell> 
        : <TableCell> {name.date ? (moment(row[name.id]).isValid() ? moment(row[name.id]).format('DD MMM yyyy') : '-') : (name.object ? row[name.id][name.objectField] : String(row[name.id]))}</TableCell>
      )}
      <TableCell>
        <CustomButton variant='contained' color='secondary' onClick={handleView}>View Listing</CustomButton>
      </TableCell>
    </TableRow>
  )
}

export default function EnhancedTable({rows, rowNames, handleRefresh, type}) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState(new Map());
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchValue, setSearchValue] = React.useState("");
  const [isRAModal, setIsRAModal] = React.useState(false);
  const [selectedRA, setSelectedRA] = React.useState({});

  const navigate = useNavigate();

  function handleView(type,id) {
    navigate(`/listing/${type}/${id}`)
  }

  function handleOpenRAModal(rrr) {
    setSelectedRA(rrr);
    setIsRAModal(true);
  }

  function handleCloseRAModal() {
    setSelectedRA({});
    setIsRAModal(false);
  }

  const handleOnSearchValueChange = (e) => {
    e.preventDefault();
    setSearchValue(e.target.value);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      let newSelecteds = new Map();
      rows.forEach((row) => newSelecteds.set(row.id, row));
      setSelected(newSelecteds);
      return;
    }
    setSelected(new Map());
  };

  const handleClick = (event, data) => {
    const selectedIndex = selected.has(data.id);

    if (selectedIndex) {
      selected.delete(data.id, data)
    } else {
      selected.set(data.id, data)
    }

    console.log('SELECTED: ', Array.from(selected.keys()))

    setSelected(new Map(selected));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.has(id);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <>
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar 
          numSelected={selected.size} 
          searchValue={searchValue} 
          handleOnSearchValueChange={handleOnSearchValueChange} 
          selected={selected}
          handleRefresh={handleRefresh}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.size}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={rowNames}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .filter(row => {
                  if(row.refashioner) {
                    row.user = row.refashioner;
                  } else if(row.refashionee) {
                    row.user = row.refashionee;
                  } else if(row.appUser) {
                    row.user = row.appUser;
                  }
                  return (row.user.username.toLowerCase().includes(searchValue) || String(row.id) === searchValue || row.title.toLowerCase().includes(searchValue))
                })
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  if(row.refashioner) {
                    row.user = row.refashioner;
                  } else if(row.refashionee) {
                    row.user = row.refashionee;
                  } else if(row.appUser) {
                    row.user = row.appUser;
                  }
                  return (
                    <NormalRow row = {row} isItemSelected = {isItemSelected} index={index} labelId = {labelId} rowNames = {rowNames} handleClick = {handleClick} handleView = {() => handleView(type, row.id)}/>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
    {/* <Modal open={isRAModal} onClose = {handleCloseRAModal}>
      <Paper sx={{position: 'absolute', top: '50%', left: '50%',transform: 'translate(-50%, -50%)', width: '80%', height: '80%', padding: 4, overflow: 'scroll'}}>
        <RefashionerApplicationModal refashionerRequest={selectedRA} handleRefresh={handleRefresh}/>
      </Paper>
    </Modal> */}
    </>
  );
}

EnhancedTable.propTypes = {
  rows: PropTypes.array.isRequired,
  rowNames: PropTypes.array.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  type : PropTypes.oneOf(['Refashioner Applications', 'Business Account Applications', 'Disputes']),
};
