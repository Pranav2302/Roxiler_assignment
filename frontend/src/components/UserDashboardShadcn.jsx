import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { getAllStoresForRating, submitRating, getMyRatings, changePassword } from '../utils/api';

const UserDashboard = ({ user, onLogout }) => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [myRatings, setMyRatings] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [activeTab, setActiveTab] = useState('stores');
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    fetchStores();
    fetchMyRatings();
  }, []);

  useEffect(() => {
    const filtered = stores.filter(store => 
      store.name.toLowerCase().includes(searchName.toLowerCase()) &&
      store.address.toLowerCase().includes(searchAddress.toLowerCase())
    );
    setFilteredStores(filtered);
  }, [stores, searchName, searchAddress]);

  const fetchStores = async () => {
    try {
      const response = await getAllStoresForRating();
      setStores(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const fetchMyRatings = async () => {
    try {
      const response = await getMyRatings();
      setMyRatings(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching my ratings:', error);
    }
  };

  const handleRating = async (storeId, rating) => {
    try {
      await submitRating({ storeId, rating });
      alert('Rating submitted successfully!');
      fetchStores();
      fetchMyRatings();
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error submitting rating. Please try again.');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold">Welcome {user.name}</h1>
            <div className="flex gap-2">
              <Button 
                variant={activeTab === 'stores' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('stores')}
              >
                Stores
              </Button>
              <Button 
                variant={activeTab === 'myratings' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('myratings')}
              >
                My Ratings
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
        {/* Stores Tab */}
        {activeTab === 'stores' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Store Directory</h2>

            {/* Search */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="searchName">Search by Store Name</Label>
                <Input
                  id="searchName"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Enter store name..."
                />
              </div>
              <div>
                <Label htmlFor="searchAddress">Search by Address</Label>
                <Input
                  id="searchAddress"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  placeholder="Enter address..."
                />
              </div>
            </div>

            {/* Store List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store) => (
                <Card key={store.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{store.address}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Overall Rating:</p>
                      <div className="flex items-center gap-2">
                        <StarRating 
                          value={parseFloat(store.overallRating) || 0} 
                          readOnly 
                        />
                        <span className="text-sm text-muted-foreground">
                          ({store.overallRating || '0.0'})
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Your Rating:</p>
                      <StarRating
                        value={store.userSubmittedRating || 0}
                        onChange={(newValue) => handleRating(store.id, newValue)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredStores.length === 0 && (
              <p className="text-center text-muted-foreground mt-8">
                No stores found
              </p>
            )}
          </div>
        )}

        {/* My Ratings Tab */}
        {activeTab === 'myratings' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Ratings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRatings.map((rating) => (
                <Card key={rating.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{rating.store.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{rating.store.address}</p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm font-medium mb-1">My Rating:</p>
                      <StarRating value={rating.rating} readOnly />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Rated on: {new Date(rating.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {myRatings.length === 0 && (
              <p className="text-center text-muted-foreground mt-8">
                You haven't rated any stores yet
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

export default UserDashboard;
