import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton, Modal } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { firestore } from '../../../../config/firebase_config';
import { TableHeader } from './TableHeader';
import { TableToolbar } from './TableToolbar';
import { EditUser } from './EditUser';

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
  onSearch: (event: any) => void;
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
  role: string;
  patientSlots: number;
  availableSlots: number;
  filledSlots: number;
  status: string;
  modify: number;

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
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'role',
    numeric: false,
    disablePadding: false,
    label: 'Role',
  },
  {
    id: 'patientSlots',
    numeric: true,
    disablePadding: false,
    label: 'Patient Slots',
  },
  {
    id: 'availableSlots',
    numeric: true,
    disablePadding: false,
    label: 'Appointment Slots',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'modify',
    numeric: false,
    disablePadding: false,
    label: 'Modify',
  },
];

const modalStyle = {
  borderRadius: '8px',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',

  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
};

export default function AdminTable() {
  // modal window for editing user
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const handleOpen = () => setModalOpen(true);

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('name');
  // can access selected rows here
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Data rows for table, filteredRows represents searched data
  // rowData represents the unfiltered query data
  const [rowData, setRowData] = React.useState<Data[]>([]);
  const [filteredRows, setFilteredRows] = React.useState<Data[]>([]);

  // CHANGE function to convert query data to table format

  function createTableData(
    UID: string,
    name: string,
    role: string,
    patientSlots: number,
    availableSlots: number,
    filledSlots: number,
    status: string,
    modify: number,
  ): Data {
    return {
      UID,
      name,
      role,
      patientSlots,
      status,
      availableSlots,
      filledSlots,
      modify,
    };
  }

  const usersRef = firestore.collection('users').where('role', '!=', 'patient');
  const filterTable = (searchText: string) => {
    setFilteredRows(rowData.filter((row) => (row.name.toLowerCase().includes(searchText.toLowerCase())
      || row.role.toLowerCase().includes(searchText.toLowerCase())
      || row.status.toLowerCase().includes(searchText.toLowerCase()) || searchText === ''
    )));
  };
  // CHANGE Fetch data for table
  useEffect(() => {
    const unsubscribe = usersRef.onSnapshot(async (snapshot: any) => {
      let tableData = new Array<Data>();

      // generate list from data and assign to table data array
      await snapshot.forEach((childSnapshot: any) => {
        const user = childSnapshot.data();
        let patientSlots = 0;
        let availableSlots = 0;
        let filledSlots = 0;
        if (user.role === 'medical') {
          patientSlots = user.patientSlots;
          availableSlots = user.availableSlots;
          filledSlots = user.filledSlots;
        }
        const { UID } = user;
        const name = [user.firstName, user.lastName].join(' ');
        const { role } = user;
        const status = 'active';
        const tableEntry = createTableData(UID, name, role, patientSlots, availableSlots, filledSlots, status, 0);
        tableData = [tableEntry, ...tableData];
        setRowData(tableData);
        setFilteredRows(tableData);
      });
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

  // this handles the click to click a row
  const handleClick = (event: React.MouseEvent<unknown>, UID: string) => {
    setModalOpen(true);
    setSelectedUser(UID);
  };
  const handleCheck = (event: React.MouseEvent<unknown>, name: string) => {
    event.preventDefault();
    event.stopPropagation();
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
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

  const handleSearch = async (event: any) => {
    filterTable(event);
  };

  const handleClose = () => {
    setModalOpen(false);
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
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.UID}
                      selected={isItemSelected}
                    >

                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"

                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.role}</TableCell>
                      <TableCell align="left">
                        {(row.role === 'medical' && row.filledSlots > row.patientSlots) && (
                          // eslint-disable-next-line react/jsx-one-expression-per-line
                          <span style={{ color: 'red' }}>{row.filledSlots}/{row.patientSlots}</span>
                        )}
                        {(row.role === 'medical' && row.filledSlots <= row.patientSlots) && (
                          // eslint-disable-next-line react/jsx-one-expression-per-line
                          <span>{row.filledSlots}/{row.patientSlots}</span>
                        )}
                        {(row.role !== 'medical') && (
                          ' N/A'
                        )}

                      </TableCell>
                      <TableCell align="left">N/A</TableCell>
                      <TableCell align="left">{row.status}</TableCell>
                      <TableCell align="right">
                        {row.role === 'medical'
                          && (
                            <IconButton aria-label="edit" onClick={(event) => handleClick(event, row.UID)}>
                              <EditOutlinedIcon />
                            </IconButton>
                          )}
                        <IconButton aria-label="delete">
                          <DeleteOutlinedIcon />
                        </IconButton>

                      </TableCell>
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
      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <EditUser handleClose={handleClose} selectedUser={selectedUser} />

        </Box>
      </Modal>

    </Box>
  );
}
