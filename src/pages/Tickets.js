import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { TicketListHead, TicketListToolbar, TicketMoreMenu } from '../sections/tickets/ticket';
import { fetchTickets, addTicket } from '../api/Tickets';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'owner', label: 'Owner', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'price', label: 'Price', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
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

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_ticket) => _ticket.OwnerName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Tickets() {
  const [tickets, setTickets] = useState([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = tickets.map((n) => n.ID);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, ID) => {
    const selectedIndex = selected.indexOf(ID);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, ID);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  useEffect(() => {
    fetchTickets().then((tickets) => {
      setTickets(tickets || []);
    })
  }, [])

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tickets.length) : 0;

  const filteredTickets = applySortFilter(tickets, getComparator(order, orderBy), filterName);
  
  const isUserNotFound = filteredTickets.length === 0;

  return (
    <Page title="Tickets">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Tickets
          </Typography>
          
          <Button variant="contained" onClick={()=>addTicket("Free", 50)} startIcon={<Iconify icon="eva:plus-fill" />}>
          {/* <Button variant="contained" component={RouterLink} to="#" startIcon={<Iconify icon="eva:plus-fill" />}> */}
            New User
          </Button>
        </Stack>

        <Card>
          <TicketListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TicketListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tickets.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredTickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { ID, Owner, Price, Status, Type, OwnerName } = row;
                    const isItemSelected = selected.indexOf(ID) !== -1;
                    // ID: "WPNSwyu6swAP9E4pGmKu"
                    // Owner: ""
                    // Price: 50
                    // Status: "Available"
                    // Type: "Free"
                    return (
                      <TableRow
                        hover
                        key={ID}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, ID)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                            <Typography variant="subtitle2" noWrap>
                              {OwnerName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{Type}</TableCell>
                        <TableCell align="left">{Price}</TableCell>
                        <TableCell align="left">
                          <Label variant="ghost" color={(Status === 'Sold' && 'error') || 'success'}>
                            {sentenceCase(Status)}
                          </Label>
                        </TableCell>

                        <TableCell align="right">
                          <TicketMoreMenu />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tickets.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
