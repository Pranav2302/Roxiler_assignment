import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Card,
  CardContent,
  Rating,
  Button,
  Grid,
  Box,
  AppBar,
  Toolbar
} from '@mui/material';
import { getAllStoresForRating, submitRating, getMyRatings, changePassword } from '../utils/api';

const UserDashboard = ({ user, onLogout }) => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [myRatings, setMyRatings] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [activeTab, setActiveTab] = useState('stores');
  
  // Password change states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    fetchStores();
    fetchMyRatings();
  }, []);

  useEffect(() => {
    // Filter stores by name and address
    const filtered = stores.filter(store => 
      store.name.toLowerCase().includes(searchName.toLowerCase()) &&
      store.address.toLowerCase().includes(searchAddress.toLowerCase())
    );
    setFilteredStores(filtered);
  }, [stores, searchName, searchAddress]);

  const fetchStores = async () => {
    try {
      const response = await getAllStoresForRating();
      console.log('Stores response:', response.data); // Debug log
      setStores(response.data.data || response.data); // Handle both response formats
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const fetchMyRatings = async () => {
    try {
      const response = await getMyRatings();
      console.log('My ratings response:', response.data); // Debug log
      setMyRatings(response.data.data || response.data); // Handle both response formats
    } catch (error) {
      console.error('Error fetching my ratings:', error);
    }
  };

  const handleRating = async (storeId, rating) => {
    try {
      await submitRating({ storeId, rating });
      alert('Rating submitted successfully!');
      fetchStores(); // Refresh to show updated rating
      fetchMyRatings(); // Refresh my ratings
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error submitting rating. Please try again.');
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

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome {user.name}
          </Typography>
          <Button color="inherit" onClick={() => setActiveTab('stores')}>
            Stores
          </Button>
          <Button color="inherit" onClick={() => setActiveTab('myratings')}>
            My Ratings
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
        {/* Stores Tab */}
        {activeTab === 'stores' && (
          <>
            <Typography variant="h4" gutterBottom>
              Store Directory
            </Typography>

            {/* Search Fields */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Search by Store Name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Search by Address"
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Store List */}
            <Grid container spacing={3}>
              {filteredStores.map((store) => (
                <Grid item xs={12} sm={6} md={4} key={store.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {store.name}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {store.address}
                      </Typography>
                      
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">Overall Rating:</Typography>
                        <Rating 
                          value={parseFloat(store.overallRating) || 0} 
                          precision={0.1}
                          readOnly 
                        />
                        <Typography variant="caption">
                          ({store.overallRating})
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">Your Rating:</Typography>
                        <Rating
                          value={store.userSubmittedRating || 0}
                          onChange={(event, newValue) => {
                            handleRating(store.id, newValue);
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {filteredStores.length === 0 && (
              <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                No stores found
              </Typography>
            )}
          </>
        )}

        {/* My Ratings Tab */}
        {activeTab === 'myratings' && (
          <>
            <Typography variant="h4" gutterBottom>
              My Ratings
            </Typography>

            <Grid container spacing={3}>
              {myRatings.map((rating) => (
                <Grid item xs={12} sm={6} md={4} key={rating.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {rating.store.name}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {rating.store.address}
                      </Typography>
                      
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">My Rating:</Typography>
                        <Rating value={rating.rating} readOnly />
                      </Box>
                      
                      <Typography variant="caption" color="textSecondary">
                        Rated on: {new Date(rating.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {myRatings.length === 0 && (
              <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                You haven't rated any stores yet
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

export default UserDashboard;