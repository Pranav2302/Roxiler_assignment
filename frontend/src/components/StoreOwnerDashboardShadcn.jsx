import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StarRating } from '@/components/ui/star-rating';
import { getOwnerDashboard, getMyStore, getMyStoreRatings, changePassword } from '../utils/api';

const StoreOwnerDashboard = ({ user, onLogout }) => {
  const [dashboardData, setDashboardData] = useState({});
  const [myStore, setMyStore] = useState([]);
  const [storeRatings, setStoreRatings] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
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
      console.log('Changing password with data:', passwordData);
      const response = await changePassword(passwordData);
      console.log('Password change response:', response.data);
      alert('Password updated successfully');
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update password';
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold">Store Owner - Welcome {user.name}</h1>
            <div className="flex gap-2">
              <Button 
                variant={activeTab === 'dashboard' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </Button>
              <Button 
                variant={activeTab === 'mystore' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('mystore')}
              >
                My Store
              </Button>
              <Button 
                variant={activeTab === 'ratings' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('ratings')}
              >
                Store Ratings
              </Button>
              <Button 
                variant={activeTab === 'password' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('password')}
              >
                Change Password
              </Button>
              <Button variant="outline" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Store Name</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {dashboardData.storeName || 'N/A'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Average Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {dashboardData.averageRating || '0.0'}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Total Ratings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {dashboardData.totalRatings || 0}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Users who rated */}
            {dashboardData.usersWhoRated && dashboardData.usersWhoRated.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Users Who Rated Your Store</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboardData.usersWhoRated.map((userRating, index) => (
                        <TableRow key={index}>
                          <TableCell>{userRating.userName}</TableCell>
                          <TableCell>{userRating.userEmail}</TableCell>
                          <TableCell>
                            <StarRating value={userRating.rating} readOnly size="sm" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* My Store Tab */}
        {activeTab === 'mystore' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Store Information</h2>
            
            {myStore && myStore.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myStore.map((store) => (
                  <Card key={store.id}>
                    <CardHeader>
                      <CardTitle>{store.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><span className="font-medium">Email:</span> {store.email}</p>
                      <p><span className="font-medium">Address:</span> {store.address}</p>
                      <p className="text-sm text-muted-foreground">Store ID: {store.id}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                No store information available
              </p>
            )}
          </div>
        )}

        {/* Store Ratings Tab */}
        {activeTab === 'ratings' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Store Ratings</h2>
            
            {storeRatings.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User Name</TableHead>
                        <TableHead>User Email</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
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
                            <StarRating value={rating.rating} readOnly size="sm" />
                          </TableCell>
                          <TableCell>
                            {new Date(rating.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <p className="text-center text-muted-foreground mt-8">
                No ratings yet for your store
              </p>
            )}
          </div>
        )}

        {/* Change Password Tab */}
        {activeTab === 'password' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>

            <Card className="max-w-md">
              <CardContent className="pt-6">
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">Current Password</Label>
                    <Input
                      id="oldPassword"
                      type="password"
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({
                        ...passwordData,
                        oldPassword: e.target.value
                      })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value
                      })}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
