import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { useEffect } from 'react';
import { format } from 'date-fns';
import { UserContext } from '../../../../context/UserContext';
import { firestore } from '../../../../config/firebase_config';
import { TableHeader } from './TableHeader';
import { TableToolbar } from './TableToolbar';

export interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

export interface EnhancedTableToolbarProps {
  numSelected: number;
  onSearch: (event: any)=> void;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// CHANGE define the type of data for each row in the table
export interface Data {
  UID: string;
  name: string;
  age: number;
  appointmentDate: string;
  status: string;
  symptoms: string;
}

// CHANGE define the header cell interface
interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}
// CHANGE populate each headercell
export const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'age',
    numeric: false,
    disablePadding: false,
    label: 'Age',
  },
  {
    id: 'appointmentDate',
    numeric: false,
    disablePadding: false,
    label: 'Appointment Dates',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'symptoms',
    numeric: false,
    disablePadding: false,
    label: 'Symptoms',
  },
];

export default function MedicalTable() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('name');
  // can access selected rows here
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { state, update } = React.useContext(UserContext);

  // Data rows for table, filteredRows represents searched data
  // rowData represents the unfiltered query data
  const [rowData, setRowData] = React.useState<Data[]>([]);
  const [filteredRows, setFilteredRows] = React.useState<Data[]>([]);
  // const [hasUpdates, sethasUpdates] = React.useState<{[key:string]:boolean}>();
  const [hasUpdates, sethasUpdates] = React.useState<string[]>([]);

  // CHANGE function to convert query data to table format

  function createTableData(
    UID: string,
    name: string,
    age: number,
    appointmentDate: string,
    status: string,
    symptoms: string,
  ): Data {
    return {
      UID,
      name,
      age,
      appointmentDate,
      status,
      symptoms,
    };
  }

  const usersRef = firestore.collection('users').where('role', '==', 'patient');

  // CHANGE Fetch data for table
  useEffect(() => {
    const unsubscribe = usersRef.onSnapshot(async (snapshot: any) => {
      let tableData = new Array<Data>();
      const hasUpdatesData: string[] = [];

      // generate list from data and assign to table data array
      await snapshot.forEach((childSnapshot: any) => {
        const user = childSnapshot.data();
        const { UID } = user;
        const name = [user.firstName, user.lastName].join(' ');
        const age = Math.floor(((Date.now() - user.dateOfBirth.toDate()) / 31536000000));
        const appointmentDate = format(new Date(1646707969351), 'Pp');
        // eslint-disable-next-line max-len
        const status = user.testsResults !== undefined ? (user.testsResults[user.testsResults.length - 1]).testResult : '';
        const symptoms = 'Severe fever';
        const userHasUpdates = Math.round(Math.random()) === 1;
        if (userHasUpdates) hasUpdatesData.push(user.UID);
        const tableEntry = createTableData(UID, name, age, appointmentDate, status, symptoms);
        tableData = [tableEntry, ...tableData];
        setRowData(tableData);
        setFilteredRows(tableData);
      });
      sethasUpdates(hasUpdatesData);
      return () => unsubscribe();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = filteredRows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // this handles the click to select a row
  const handleClick = (event: React.MouseEvent<unknown>, UID: string) => {
    if (hasUpdates.includes(UID)) {
      sethasUpdates(hasUpdates.filter((ID) => ID !== UID));
      // TODO: set hasUpdates  to false in user (UID)
      //
    }
    // TODO: redirect to patient page
    //
    // TODO: delete the following 2 lines
    // eslint-disable-next-line no-alert
    alert(`${UID} is selected`);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value;
    setFilteredRows(rowData.filter((row) => (row.name.toLowerCase().includes(searchText.toLowerCase())
       || row.appointmentDate.toString().toLowerCase().includes(searchText.toLowerCase())
       || row.status.toLowerCase().includes(searchText.toLowerCase())
    )));
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableToolbar numSelected={selected.length} onSearch={handleSearch} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <TableHeader
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredRows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(filteredRows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.UID);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.UID)}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.UID}
                      selected={hasUpdates.includes(row.UID)}
                    >
                      <TableCell />
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.age}</TableCell>
                      <TableCell align="left">{row.appointmentDate}</TableCell>
                      <TableCell align="left">{row.status}</TableCell>
                      <TableCell align="left">{row.symptoms}</TableCell>
                    </TableRow>
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
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

    </Box>
  );
}
