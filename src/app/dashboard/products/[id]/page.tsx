'use client';

import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Grid, 
  Divider,
  Chip,
  CircularProgress,
  Breadcrumbs,
  Rating,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { ChevronLeft, ShoppingCart, Tag, Star, Box as Package, Info } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface ProductDetail {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
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

  if (error || !product) {
    return (
      <DashboardLayout>
        <Typography color="error">Error: {error || 'Product not found'}</Typography>
        <Button startIcon={<ChevronLeft size={18} />} onClick={() => router.back()}>Back</Button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link href="/dashboard/products" style={{ textDecoration: 'none', color: 'inherit' }}>Products</Link>
          <Typography color="text.primary">Product Details</Typography>
        </Breadcrumbs>
        <Button 
          startIcon={<ChevronLeft size={18} />} 
          onClick={() => router.back()}
          sx={{ mb: 2 }}
        >
          Back to Products
        </Button>
      </Box>

      <Grid container spacing={6}>
        {/* Images Carousel Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 4, bgcolor: '#f9f9f9', textAlign: 'center' }}>
            <Box 
              component="img" 
              src={product.images[activeImage]} 
              alt={product.title}
              sx={{ 
                width: '100%', 
                height: 400, 
                objectFit: 'contain',
                transition: 'opacity 0.3s'
              }} 
            />
          </Paper>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, overflowX: 'auto', pb: 1 }}>
            {product.images.map((img, index) => (
              <Paper 
                key={index}
                elevation={0}
                onClick={() => setActiveImage(index)}
                sx={{ 
                  p: 0.5, 
                  cursor: 'pointer', 
                  border: '2px solid', 
                  borderColor: activeImage === index ? 'primary.main' : 'transparent',
                  borderRadius: 2,
                  minWidth: 80,
                  height: 80
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </Paper>
            ))}
          </Box>
        </Grid>

        {/* Product Info Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box>
            <Chip label={product.category} color="primary" size="small" sx={{ mb: 2, textTransform: 'uppercase', fontWeight: 700 }} />
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>
              {product.title}
            </Typography>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {product.brand}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 3 }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                ${product.price}
              </Typography>
              {product.discountPercentage > 0 && (
                <Chip 
                  label={`${product.discountPercentage}% OFF`} 
                  color="error" 
                  size="small" 
                  sx={{ fontWeight: 700 }} 
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
              <Rating value={product.rating} readOnly precision={0.5} />
              <Typography variant="body1">({product.rating})</Typography>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Description</Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {product.description}
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <List>
                  <ListItem disablePadding sx={{ mb: 2 }}>
                    <ListItemIcon><Star size={20} color="#1976d2" /></ListItemIcon>
                    <ListItemText primary="Warranty" secondary={product.warrantyInformation} />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemIcon><Package size={20} color="#1976d2" /></ListItemIcon>
                    <ListItemText primary="Stock Status" secondary={product.stock > 0 ? `${product.stock} Units` : 'Out of Stock'} />
                  </ListItem>
                </List>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <List>
                  <ListItem disablePadding sx={{ mb: 2 }}>
                    <ListItemIcon><ShoppingCart size={20} color="#1976d2" /></ListItemIcon>
                    <ListItemText primary="Shipping" secondary={product.shippingInformation} />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemIcon><Info size={20} color="#1976d2" /></ListItemIcon>
                    <ListItemText primary="Dimensions" secondary={`${product.dimensions.width}x${product.dimensions.height}x${product.dimensions.depth} cm`} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
