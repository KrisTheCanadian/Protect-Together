import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { IconButton, Modal } from '@mui/material';
import OpenInNewOutlined from '@mui/icons-material/OpenInNewOutlined';
import { caseSeverity } from '../PatientInfo/PatientInfo';
import { UserContext } from '../../../../context/UserContext';
import { firestore } from '../../../../config/firebase_config';
import { TableHeader } from './TableHeader';
import { TableToolbar } from './TableToolbar';
import PatientInfoList from '../PatientInfo/PatientInfoList';

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
const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { lg: '50%', md: '75%', sm: '100%', xs: '100%' },
  boxShadow: 0,
  margin: 0,
  p: 4,
};

type Symptoms = {
  date: Timestamp,
  userSymptoms: string[],
};

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
  severity: string
  latestSymptoms: number;
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
    id: 'severity',
    numeric: false,
    disablePadding: false,
    label: 'Severity',
  },
  {
    id: 'latestSymptoms',
    numeric: false,
    disablePadding: false,
    label: 'Latest Symptoms',
  },
];

type Props = {
  handlePatientClick: any,
};

export default function MedicalTable({ handlePatientClick }: Props) {
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
  const [hasUpdates, sethasUpdates] = React.useState<string[]>([]);
  const [ptSymptoms, SetPtSymptoms] = React.useState<Symptoms>();
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const [modalContent, setModalContent] = React.useState<number>(0);

  // CHANGE function to convert query data to table format

  function createTableData(
    UID: string,
    name: string,
    age: number,
    appointmentDate: string,
    status: string,
    severity: string,
    latestSymptoms: number,
  ): Data {
    return {
      UID,
      name,
      age,
      appointmentDate,
      status,
      severity,
      latestSymptoms,
    };
  }

  const usersRef = firestore.collection('users').where('assignedDoctor', '==', state.id);

  const rowNewInfoStyle = {
    backgroundColor: '#FDFFA9',
    '&:hover': {
      backgroundColor: '#F9F7CF!important', // `${theme.palette.warning.dark}!important`,
      cursor: 'pointer',
    },
  };

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
        const latestSymptoms = user.patientSymptoms !== undefined
          ? user.patientSymptoms[user.patientSymptoms.length - 1] : undefined;
        const severity = caseSeverity(user.score);
        const userHasUpdates = Math.round(Math.random()) === 1;
        if (userHasUpdates) hasUpdatesData.push(user.UID);
        const tableEntry = createTableData(UID, name, age, appointmentDate, status, severity, 0);
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
    }
    handlePatientClick(UID);
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

  const handleSymptomsClick = (PID: string) => {
    const patientRef = firestore.collection('users').doc(PID);
    const fetchData = async () => {
      const patientDataSnapshot = await patientRef.get();
      const patient = patientDataSnapshot.data();
      if (patient) {
        const latestSymptoms = patient.patientSymptoms !== undefined
          ? patient.patientSymptoms[patient.patientSymptoms.length - 1] : undefined;
        SetPtSymptoms(latestSymptoms);
      }
    };
    fetchData().then(() => { setModalContent(0); handleOpen(); });
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
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.UID}
                      sx={
                        hasUpdates.includes(row.UID)
                          ? rowNewInfoStyle : { backgroundColor: 'inherited', cursor: 'pointer' }
                      }
                    >
                      <TableCell />
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        onClick={(event) => handleClick(event, row.UID)}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="left" onClick={(event) => handleClick(event, row.UID)}>{row.age}</TableCell>
                      <TableCell
                        align="left"
                        onClick={(event) => handleClick(event, row.UID)}
                      >
                        {row.appointmentDate}
                      </TableCell>
                      <TableCell align="left" onClick={(event) => handleClick(event, row.UID)}>{row.status}</TableCell>
                      <TableCell
                        align="left"
                        onClick={(event) => handleClick(event, row.UID)}
                      >
                        {row.severity}
                      </TableCell>
                      <TableCell align="left" onClick={(event) => handleSymptomsClick(row.UID)}>
                        <IconButton
                          aria-label="symptoms"
                          onClick={(event) => handleSymptomsClick(row.UID)}
                        >
                          <OpenInNewOutlined />
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
        <Box sx={style}>
          { modalContent === 0
            && (
            <PatientInfoList
              listTitle={`Latest Symptoms ${ptSymptoms
                ? `(${format(ptSymptoms.date.toDate(), 'yyyy-LL-dd KK:mm:ss a')})` : ''}`}
              listItems={ptSymptoms?.userSymptoms.map((symp: string) => ({ primary: symp, secondary: '' }))}
            />
            )}
        </Box>
      </Modal>
    </Box>
  );
}
