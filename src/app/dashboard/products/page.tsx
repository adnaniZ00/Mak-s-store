'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Rating,
  Pagination,
  CardActionArea,
  Button,
  Divider
} from '@mui/material';
import { Search, Eye, Filter, ShoppingCart, Tag } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const { 
    products, 
    categories,
    total, 
    skip, 
    limit, 
    searchQuery, 
    selectedCategory,
    isLoading, 
    setSearchQuery, 
    setCategory,
    setPagination, 
    fetchProducts,
    fetchCategories
  } = useProductStore();
  
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [skip, limit, searchQuery, selectedCategory, fetchProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPagination((value - 1) * limit, limit);
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Product Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore our product catalog with advanced filtering and search.
        </Typography>
      </Box>

      {/* Filters Area */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search products..."
                variant="outlined"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} color="#666" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button variant="contained" type="submit">Search</Button>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory || 'all'}
                label="Category"
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Products Grid */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
              <Card 
                elevation={0} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 40px 0 rgba(0,0,0,0.1)',
                  }
                }}
              >
                <CardActionArea onClick={() => router.push(`/dashboard/products/${product.id}`)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.thumbnail}
                    alt={product.title}
                    sx={{ objectFit: 'contain', p: 2, bgcolor: '#f9f9f9' }}
                  />
                </CardActionArea>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="caption" color="primary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                      {product.category}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                      ${product.price}
                    </Typography>
                  </Box>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1, height: 60, overflow: 'hidden' }}>
                    {product.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={product.rating} readOnly size="small" precision={0.5} />
                    <Typography variant="caption" color="text.secondary">
                      ({product.rating})
                    </Typography>
                  </Box>
                </CardContent>
                <Divider />
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color={product.stock > 10 ? 'success.main' : 'warning.main'} sx={{ fontWeight: 600 }}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </Typography>
                  <Button size="small" startIcon={<Eye size={16} />} onClick={() => router.push(`/dashboard/products/${product.id}`)}>
                    Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
        <Pagination 
          count={Math.ceil(total / limit)} 
          page={Math.floor(skip / limit) + 1} 
          onChange={handlePageChange} 
          color="primary" 
          size="large"
        />
      </Box>
    </DashboardLayout>
  );
}
