'use client';

import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Grid, 
  Avatar, 
  Divider,
  Chip,
  CircularProgress,
  IconButton,
  Breadcrumbs
} from '@mui/material';
import { ChevronLeft, Mail, Phone, MapPin, Briefcase, Calendar, User as UserIcon } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface UserDetail {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: {
    color: string;
    type: string;
  };
  address: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  company: {
    name: string;
    title: string;
    department: string;
  };
}

export default function UserDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/users/${id}`);
        if (!response.ok) throw new Error('User not found');
        const data = await response.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (error || !user) {
    return (
      <DashboardLayout>
        <Typography color="error">Error: {error || 'User not found'}</Typography>
        <Button startIcon={<ChevronLeft size={18} />} onClick={() => router.back()}>Back</Button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link href="/dashboard/users" style={{ textDecoration: 'none', color: 'inherit' }}>Users</Link>
          <Typography color="text.primary">User Details</Typography>
        </Breadcrumbs>
        <Button 
          startIcon={<ChevronLeft size={18} />} 
          onClick={() => router.back()}
          sx={{ mb: 2 }}
        >
          Back to Users
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Avatar 
              src={user.image} 
              sx={{ width: 150, height: 150, mb: 2, border: '4px solid', borderColor: 'primary.light' }} 
            />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              @{user.username}
            </Typography>
            <Chip 
              label={user.company.title} 
              color="primary" 
              sx={{ mt: 1, fontWeight: 600 }} 
            />
            
            <Divider sx={{ width: '100%', my: 3 }} />
            
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Mail size={18} color="#666" />
                <Typography variant="body2">{user.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Phone size={18} color="#666" />
                <Typography variant="body2">{user.phone}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Detailed Info */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={3}>
            {/* Professional Info */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
                  <Briefcase size={20} /> Professional Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">Company</Typography>
                    <Typography variant="body1">{user.company.name}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">Department</Typography>
                    <Typography variant="body1">{user.company.department}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Personal Info */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
                  <UserIcon size={20} /> Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">Age</Typography>
                    <Typography variant="body1">{user.age}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">Gender</Typography>
                    <Typography variant="body1">{user.gender}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">Birth Date</Typography>
                    <Typography variant="body1">{user.birthDate}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">Blood Group</Typography>
                    <Typography variant="body1">{user.bloodGroup}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Address */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
                  <MapPin size={20} /> Location
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1">{user.address.address}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.address.city}, {user.address.state} {user.address.postalCode}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
