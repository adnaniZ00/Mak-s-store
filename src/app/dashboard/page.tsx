'use client';

import React, { useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button,
  Avatar,
  Paper,
  Divider
} from '@mui/material';
import { Users, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserStore } from '@/store/useUserStore';
import { useProductStore } from '@/store/useProductStore';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { total: totalUsers, fetchUsers } = useUserStore();
  const { total: totalProducts, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, [fetchUsers, fetchProducts]);

  const stats = [
    { title: 'Total Users', value: totalUsers ? `${totalUsers}+` : '...', icon: <Users size={24} />, color: '#1976d2', link: '/dashboard/users' },
    { title: 'Total Products', value: totalProducts ? `${totalProducts}+` : '...', icon: <ShoppingBag size={24} />, color: '#dc004e', link: '/dashboard/products' },
  ];

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome back, {user?.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening in your admin panel today.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  bgcolor: `${stat.color}15`, 
                  color: stat.color,
                  mr: 2
                }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                </Box>
              </CardContent>
              <Divider />
              <Box sx={{ p: 1, px: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  size="small" 
                  endIcon={<ArrowRight size={16} />} 
                  component={Link} 
                  href={stat.link}
                >
                  View All
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      
    </DashboardLayout>
  );
}
