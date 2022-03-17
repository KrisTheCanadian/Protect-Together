import React, { useEffect, useState } from 'react';

import { TableCell, TableContainer, TableHead, TableRow, Paper, Table, TableBody } from '@mui/material/';
import { firestore } from '../../../config/firebase_config';

function createData(
  name: string,
  score: number,
  UID: string,

) {
  return { name, score, UID };
}

interface PatientTableData {
  name: string,
  score: number,
  UID: string,
}

export default function PatientTable() {
  const usersRef = firestore.collection('users').where('role', '==', 'patient')
    .where('assignedDoctor', '==', 'requestedDoctor');
  const [rows, setRows] = useState<PatientTableData[]>([]);

  useEffect(() => {
    usersRef.onSnapshot(async (snapshot) => {
      let tableData = new Array<PatientTableData>();
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.data();
        const name = `${user.firstName} ${user.lastName}`;
        const newRow = createData(name, user.score, user.UID);
        tableData = [newRow, ...tableData];
      });
      setRows(tableData);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (

    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.UID}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.score}
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
