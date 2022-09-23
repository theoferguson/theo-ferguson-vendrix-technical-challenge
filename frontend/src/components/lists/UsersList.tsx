// Types/Interfaces
import { User } from '../../schemas/users';
// Components
import {
  Table,
  Box,
  Container,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableBody,
  TableCell,
  Paper,
} from '@mui/material';
// --------------------------------------------------------------
// --------------------------------------------------------------

/**
 * ! !!!!!!! ATTENTION !!!!!!!!
 * The below list is in a base state.
 * Your task is to improve the UX/UI to the best of your ability.
 *
 * TODO: Style/rearrange the list to maximize UI/UX
 *
 * ! !!!!!!!!!!!!!!!!!!!!!!!!!!
 */

// ***** Define styles ***** //

// ----------------------------------------------------------------

// ***** Define List Item ***** //
interface UserRowProps {
  user: User;
}
function UserRow({ user }: UserRowProps) {
  return (
    <TableRow key={user.name.givenName} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component="th" scope="row">
        {user.name.givenName}
      </TableCell>
      <TableCell>{user.name.familyName}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell align="center">{user.email}</TableCell>
    </TableRow>
  );
}

// ----------------------------------------------------------------
// ---------------------------------------------------------------

interface UsersListProps {
  users: User[];
}

export default function UsersList({ users }: UsersListProps) {
  return (
    <Box>
      <Container sx={{ p: 1 }}>
        <Typography variant='h4'>Users</Typography>
      </Container>

      {users.length ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="user table">
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="center">Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <UserRow user={user} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>{'No users'}</Typography>
      )}
    </Box>
  );
}
