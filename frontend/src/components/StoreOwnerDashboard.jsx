import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  AppBar,
  Toolbar,
  Button,
  Rating,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import { getOwnerDashboard, getMyStore, getMyStoreRatings, changePassword } from '../utils/api';

const StoreOwnerDashboard = ({ user, onLogout }) => {
  const [dashboardData, setDashboardData] = useState({});
  const [myStore, setMyStore] = useState([]);
  const [storeRatings, setStoreRatings] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  // Password change states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchDashboard(),
        fetchMyStore(),
        fetchStoreRatings()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      const response = await getOwnerDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const fetchMyStore = async () => {
    try {
      const response = await getMyStore();
      setMyStore(response.data);
    } catch (error) {
      console.error('Error fetching my store:', error);
    }
  };

  const fetchStoreRatings = async () => {
    try {
      const response = await getMyStoreRatings();
      setStoreRatings(response.data);
    } catch (error) {
      console.error('Error fetching store ratings:', error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await changePassword(passwordData);
      alert('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to update password');
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Store Owner - Welcome {user.name}
          </Typography>
          <Button color="inherit" onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => setActiveTab('mystore')}>
            My Store
          </Button>
          <Button color="inherit" onClick={() => setActiveTab('ratings')}>
            Store Ratings
          </Button>
          <Button color="inherit" onClick={() => setActiveTab('password')}>
            Change Password
          </Button>
          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            <Typography variant="h4" gutterBottom>
              Dashboard Overview
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="textSecondary">
                      Store Name
                    </Typography>
                    <Typography variant="h5">
                      {dashboardData.storeName || 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="textSecondary">
                      Average Rating
                    </Typography>
                    <Typography variant="h4">
                      {dashboardData.averageRating || '0.0'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="textSecondary">
                      Total Ratings
                    </Typography>
                    <Typography variant="h4">
                      {dashboardData.totalRatings || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Users who rated */}
            {dashboardData.usersWhoRated && dashboardData.usersWhoRated.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Users Who Rated Your Store
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>User Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Rating</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData.usersWhoRated.map((userRating, index) => (
                        <TableRow key={index}>
                          <TableCell>{userRating.userName}</TableCell>
                          <TableCell>{userRating.userEmail}</TableCell>
                          <TableCell>
                            <Rating value={userRating.rating} readOnly size="small" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </>
        )}

        {/* My Store Tab */}
        {activeTab === 'mystore' && (
          <>
            <Typography variant="h4" gutterBottom>
              My Store Information
            </Typography>
            
            {myStore && myStore.length > 0 ? (
              <Grid container spacing={3}>
                {myStore.map((store) => (
                  <Grid item xs={12} md={6} key={store.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h5" gutterBottom>
                          {store.name}
                        </Typography>
                        
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                          Email: {store.email}
                        </Typography>

                        <Typography variant="h6" color="textSecondary" gutterBottom>
                          Address: {store.address}
                        </Typography>

                        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                          Store ID: {store.id}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="h6" align="center">
                No store information available
              </Typography>
            )}
          </>
        )}

        {/* Store Ratings Tab */}
        {activeTab === 'ratings' && (
          <>
            <Typography variant="h4" gutterBottom>
              Store Ratings
            </Typography>
            
            {storeRatings.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User Name</TableCell>
                      <TableCell>User Email</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {storeRatings.map((rating) => (
                      <TableRow key={rating.id}>
                        <TableCell>
                          {rating.user ? rating.user.name : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {rating.user ? rating.user.email : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Rating value={rating.rating} readOnly size="small" />
                        </TableCell>
                        <TableCell>
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                No ratings yet for your store
              </Typography>
            )}
          </>
        )}

        {/* Change Password Tab */}
        {activeTab === 'password' && (
          <>
            <Typography variant="h4" gutterBottom>
              Change Password
            </Typography>

            <Card sx={{ maxWidth: 500 }}>
              <CardContent>
                <Box component="form" onSubmit={handlePasswordChange}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Current Password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value
                    })}
                    required
                  />
                  
                  <TextField
                    fullWidth
                    margin="normal"
                    label="New Password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value
                    })}
                    required
                  />
                  
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2 }}
                    fullWidth
                  >
                    Update Password
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </>
        )}
      </Container>
    </>
  );
};

export default StoreOwnerDashboard;