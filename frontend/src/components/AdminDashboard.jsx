import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box
} from '@mui/material';
import { 
  getDashboardStats, 
  getAllUsers, 
  getAllStores, 
  addUser, 
  addStore 
} from '../utils/api';

function AdminDashboard({ user, onLogout }) {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [storeOwners, setStoreOwners] = useState([]);
  const [userDialog, setUserDialog] = useState(false);
  const [storeDialog, setStoreDialog] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', ownerId: '' });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, usersRes, storesRes] = await Promise.all([
        getDashboardStats(),
        getAllUsers(),
        getAllStores()
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setStores(storesRes.data.data);
      
      // Filter store owners for the dropdown
      const owners = usersRes.data.data.filter(user => user.role === 'STORE_OWNER');
      setStoreOwners(owners);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      await addUser(newUser);
      setUserDialog(false);
      setNewUser({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
      loadDashboardData();
      alert('User added successfully');
    } catch (error) {
      alert('Error adding user');
    }
  };

  const handleAddStore = async () => {
    try {
      if (!newStore.ownerId) {
        alert('Please select a store owner');
        return;
      }
      
      await addStore(newStore);
      setStoreDialog(false);
      setNewStore({ name: '', email: '', address: '', ownerId: '' });
      loadDashboardData();
      alert('Store added successfully');
    } catch (error) {
      console.error('Error adding store:', error);
      alert('Error adding store: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button variant="outlined" onClick={onLogout}>Logout</Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} style={{ marginBottom: '30px' }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{stats.totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Stores</Typography>
              <Typography variant="h4">{stats.totalStores}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Ratings</Typography>
              <Typography variant="h4">{stats.totalRatings}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box mb={3}>
        <Button 
          variant="contained" 
          onClick={() => setUserDialog(true)}
          style={{ marginRight: '10px' }}
        >
          Add User
        </Button>
        <Button variant="contained" onClick={() => setStoreDialog(true)}>
          Add Store
        </Button>
      </Box>

      {/* Users Table */}
      <Typography variant="h5" gutterBottom>All Users</Typography>
      <TableContainer component={Paper} style={{ marginBottom: '30px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Stores Table */}
      <Typography variant="h5" gutterBottom>All Stores</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store.id}>
                <TableCell>{store.name}</TableCell>
                <TableCell>{store.email}</TableCell>
                <TableCell>{store.address}</TableCell>
                <TableCell>{store.averageRating || 'No ratings'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add User Dialog */}
      <Dialog open={userDialog} onClose={() => setUserDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Address"
            value={newUser.address}
            onChange={(e) => setNewUser({...newUser, address: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Role"
            value={newUser.role}
            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value="NORMAL_USER">Normal User</option>
            <option value="STORE_OWNER">Store Owner</option>
            <option value="SYSTEM_ADMIN">System Admin</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialog(false)}>Cancel</Button>
          <Button onClick={handleAddUser} variant="contained">Add User</Button>
        </DialogActions>
      </Dialog>

      {/* Add Store Dialog */}
      <Dialog open={storeDialog} onClose={() => setStoreDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Store</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Store Name"
            value={newStore.name}
            onChange={(e) => setNewStore({...newStore, name: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            value={newStore.email}
            onChange={(e) => setNewStore({...newStore, email: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Address"
            value={newStore.address}
            onChange={(e) => setNewStore({...newStore, address: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Store Owner"
            value={newStore.ownerId}
            onChange={(e) => setNewStore({...newStore, ownerId: e.target.value})}
            margin="normal"
            SelectProps={{ native: true }}
            helperText="Only users with STORE_OWNER role can be selected"
          >
            <option value="">Select a store owner</option>
            {storeOwners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStoreDialog(false)}>Cancel</Button>
          <Button onClick={handleAddStore} variant="contained">Add Store</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AdminDashboard;