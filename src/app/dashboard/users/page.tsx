'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { Search, Eye, Filter } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const { 
    users, 
    total, 
    skip, 
    limit, 
    searchQuery, 
    isLoading, 
    setSearchQuery, 
    setPagination, 
    fetchUsers 
  } = useUserStore();
  
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Fetch users on mount and when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [skip, limit, searchQuery, fetchUsers]);

  // Handle Search with debounce or manual trigger
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPagination(newPage * limit, limit);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPagination(0, parseInt(event.target.value, 10));
  };

  const handleViewUser = useCallback((id: number) => {
    router.push(`/dashboard/users/${id}`);
  }, [router]);

  // Memoize table headers to prevent unnecessary re-renders
  const tableHeaders = useMemo(() => (
    <TableRow>
      <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
      <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
      <TableCell sx={{ fontWeight: 700 }}>Gender</TableCell>
      <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
      <TableCell sx={{ fontWeight: 700 }}>Company</TableCell>
      <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
    </TableRow>
  ), []);

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse and search through all registered users in the system.
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search users by name, email..."
            variant="outlined"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            disabled={isLoading}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#666" />
                </InputAdornment>
              ),
            }}
          />
          <IconButton type="submit" color="primary" disabled={isLoading}>
            <Filter size={20} />
          </IconButton>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ position: 'relative', minHeight: 400 }}>
        {isLoading && (
          <Box sx={{ 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: 'rgba(255,255,255,0.7)',
            zIndex: 1
          }}>
            <CircularProgress />
          </Box>
        )}
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            {tableHeaders}
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={user.image} sx={{ width: 40, height: 40 }}>
                      {user.firstName[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {user.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.gender} 
                    size="small" 
                    color={user.gender === 'female' ? 'secondary' : 'primary'} 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.company.name}</TableCell>
                <TableCell align="right">
                  <Tooltip title="View Details">
                    <IconButton size="small" onClick={() => handleViewUser(user.id)} color="primary">
                      <Eye size={18} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No users found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={limit}
          page={Math.floor(skip / limit)}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </TableContainer>
    </DashboardLayout>
  );
}
