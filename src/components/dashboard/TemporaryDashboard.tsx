import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import React from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { firestore } from '../../config/firebase_config';

const TemporaryDashboard = () => {
    interface Data {
        name: string;
        role: string;
        patientSlots: number;
        appointmentSlots: number;
        status: string;
      }

    const userConverter = {
      toFirestore(post: Data): DocumentData {
        return { name: post.name, role: post.role };
      },
      fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions,
      ): Data {
        const data = snapshot.data(options)!;
        return { name: data.firstName, role: data.role, patientSlots: 0, appointmentSlots: 0, status: 'active' };
      },
    };
    let usersRef = firestore.collection('users');
    if (usersRef) {
      usersRef = usersRef.withConverter<Data>(userConverter);
    }
    const usersQuery = usersRef.where('role', '!=', 'patient');
    console.log(usersQuery);
    const [users2] = useCollectionData(usersQuery, { idField: 'UID' });

    return (<div>TemporaryDashboard</div>);
};

export default TemporaryDashboard;
