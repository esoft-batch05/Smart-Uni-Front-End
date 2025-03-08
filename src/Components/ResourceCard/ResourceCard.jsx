import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Chip, 
  Box, 
  Grid, 
  Rating, 
  Divider,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import InventoryIcon from '@mui/icons-material/Inventory';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';

// Styled components for better visuals
const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  maxWidth: '340px', // More compact width
  margin: '0 auto', // Center the card if in a container larger than card
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
  borderRadius: '12px',
  overflow: 'hidden',
}));

const ResourceMedia = styled(CardMedia)(({ theme }) => ({
  paddingTop: '56.25%', // 16:9 aspect ratio (responsive)
  position: 'relative',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  [theme.breakpoints.down('sm')]: {
    paddingTop: '75%', // Taller on mobile for better visibility
  },
}));

const ResourceBadge = styled(Chip)(({ theme, available }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  fontWeight: 'bold',
  fontSize: '0.75rem',
  height: '24px',
  backgroundColor: available ? theme.palette.success.main : theme.palette.error.main,
  color: theme.palette.common.white,
}));

const ResourceContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2), // Reduced padding
}));

const ResourceInfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(0.75), // Reduced spacing
  '& svg': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
    fontSize: '1rem', // Smaller icons
  },
}));

const BookButton = styled(Button)(({ theme, available }) => ({
  marginTop: theme.spacing(1.5),
  fontWeight: 'bold',
  width: '100%',
  padding: theme.spacing(0.75, 1.5), // Smaller button height
}));

// Demo resource data (in a real app, this would come from props)
const resourceTypes = [
  {
    id: 1,
    title: "Professional DSLR Camera",
    type: "Photography",
    image: "https://source.unsplash.com/random/400x300/?camera",
    stock: 12,
    available: true,
    rating: 4.8,
    description: "High-end DSLR camera with 4K video capability and multiple lens options."
  },
  {
    id: 2,
    title: "LED Lighting Kit",
    type: "Lighting",
    image: "https://source.unsplash.com/random/400x300/?lighting",
    stock: 8,
    available: true,
    rating: 4.5,
    description: "Professional lighting kit with adjustable brightness and color temperature."
  },
  {
    id: 3,
    title: "Wireless Microphone Set",
    type: "Audio",
    image: "https://source.unsplash.com/random/400x300/?microphone",
    stock: 0,
    available: false,
    rating: 4.7,
    description: "Lavalier and handheld wireless microphone set for clear audio recording."
  }
];

function ResourceCard({ resource = resourceTypes[0], onBookItem }) {
  const handleBookClick = () => {
    if (onBookItem && typeof onBookItem === 'function') {
      onBookItem(resource);
    } else {
      console.log('Booking resource:', resource);
    }
  };

  return (
    <StyledCard>
      <ResourceMedia
        image={resource.image}
        title={resource.title}
      >
        <ResourceBadge 
          label={resource.available ? "Available" : "Out of Stock"} 
          available={resource.available ? 1 : 0}
          size="small"
        />
      </ResourceMedia>
      
      <ResourceContent>
        <Typography variant="h6" component="div" gutterBottom fontWeight="bold" sx={{ mb: 0.5 }}>
          {resource.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ 
          mb: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 1.3
        }}>
          {resource.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={resource.rating} precision={0.1} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontSize: '0.75rem' }}>
            {resource.rating}/5.0
          </Typography>
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        <ResourceInfoItem>
          <CameraAltIcon fontSize="small" />
          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
            Type: <strong>{resource.type}</strong>
          </Typography>
        </ResourceInfoItem>
        
        <ResourceInfoItem>
          <InventoryIcon fontSize="small" />
          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
            In Stock: <strong>{resource.stock} units</strong>
          </Typography>
        </ResourceInfoItem>
        
        <ResourceInfoItem>
          <EventAvailableIcon fontSize="small" />
          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
            Status: <strong>{resource.available ? 'Ready to Book' : 'Currently Unavailable'}</strong>
          </Typography>
        </ResourceInfoItem>
        
        <BookButton 
          variant="contained" 
          color="primary"
          startIcon={<BookmarkAddIcon />}
          onClick={handleBookClick}
          disabled={!resource.available || resource.stock === 0}
          size="small"
        >
          {resource.available ? 'Book This Item' : 'Currently Unavailable'}
        </BookButton>
      </ResourceContent>
    </StyledCard>
  );
}



export { ResourceCard };
export default ResourceCard;