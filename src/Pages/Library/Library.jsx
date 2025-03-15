import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardMedia, CardContent, CardActions,
  Typography, Button, TextField, Box, Chip, FormControl,
  InputLabel, Select, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Snackbar, Alert
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SearchIcon from '@mui/icons-material/Search';

// Sample book data
const sampleBooks = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Classic",
    year: 1960,
    description: "The story of racial injustice and the loss of innocence in the American South during the Great Depression.",
    imageUrl: "https://via.placeholder.com/150x220?text=Mockingbird",
    stock: 5,
    available: 3
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    year: 1949,
    description: "A dystopian social science fiction novel set in an imagined future where totalitarianism is the form of government.",
    imageUrl: "https://via.placeholder.com/150x220?text=1984",
    stock: 8,
    available: 0
  },
  {
    id: 3,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    year: 1925,
    description: "A novel that examines the dark side of the American Dream during the Jazz Age.",
    imageUrl: "https://via.placeholder.com/150x220?text=Gatsby",
    stock: 4,
    available: 2
  },
  {
    id: 4,
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    genre: "Fantasy",
    year: 1997,
    description: "The first novel in the Harry Potter series that follows a young wizard's adventures at Hogwarts School of Witchcraft and Wizardry.",
    imageUrl: "https://via.placeholder.com/150x220?text=HarryPotter",
    stock: 12,
    available: 7
  },
  {
    id: 5,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    year: 1937,
    description: "A fantasy novel about the adventures of hobbit Bilbo Baggins, who embarks on a quest to reclaim a treasure guarded by a dragon.",
    imageUrl: "https://via.placeholder.com/150x220?text=Hobbit",
    stock: 6,
    available: 4
  },
  {
    id: 6,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    year: 1813,
    description: "A romantic novel of manners that follows the character development of Elizabeth Bennet.",
    imageUrl: "https://via.placeholder.com/150x220?text=Pride",
    stock: 7,
    available: 3
  }
];

function Library() {
  const [books, setBooks] = useState(sampleBooks);
  const [filteredBooks, setFilteredBooks] = useState(sampleBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Extract unique genres for filter dropdown
  const genres = ['All', ...new Set(books.map(book => book.genre))];

  // Apply filters and search
  useEffect(() => {
    let results = books;
    
    // Apply search term
    if (searchTerm) {
      results = results.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply genre filter
    if (genreFilter !== 'All') {
      results = results.filter(book => book.genre === genreFilter);
    }
    
    // Apply availability filter
    if (availabilityFilter === 'Available') {
      results = results.filter(book => book.available > 0);
    } else if (availabilityFilter === 'Unavailable') {
      results = results.filter(book => book.available === 0);
    }
    
    setFilteredBooks(results);
  }, [books, searchTerm, genreFilter, availabilityFilter]);

  // Handle book booking
  const handleBooking = (book) => {
    setSelectedBook(book);
    setBookingDialogOpen(true);
  };

  // Confirm booking
  const confirmBooking = () => {
    if (selectedBook && selectedBook.available > 0) {
      // Update book availability
      const updatedBooks = books.map(book => {
        if (book.id === selectedBook.id) {
          return {
            ...book,
            available: book.available - 1
          };
        }
        return book;
      });
      
      setBooks(updatedBooks);
      setBookingDialogOpen(false);
      
      // Show success message
      setSnackbarMessage(`"${selectedBook.title}" has been booked successfully!`);
      setSnackbarOpen(true);
    } else {
      // Show error message
      setSnackbarMessage('This book is not available for booking.');
      setSnackbarOpen(true);
      setBookingDialogOpen(false);
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      {/* Filter and search section */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          placeholder="Search books..."
          size="small"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />,
          }}
          sx={{ flexGrow: 1, minWidth: '200px' }}
        />
        
        <FormControl size="small" sx={{ minWidth: '150px' }}>
          <InputLabel>Genre</InputLabel>
          <Select
            value={genreFilter}
            label="Genre"
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            {genres.map(genre => (
              <MenuItem key={genre} value={genre}>{genre}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: '150px' }}>
          <InputLabel>Availability</InputLabel>
          <Select
            value={availabilityFilter}
            label="Availability"
            onChange={(e) => setAvailabilityFilter(e.target.value)}
          >
            <MenuItem value="All">All Books</MenuItem>
            <MenuItem value="Available">Available Only</MenuItem>
            <MenuItem value="Unavailable">Unavailable Only</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Book grid */}
      <Grid container spacing={3}>
        {filteredBooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={book.imageUrl}
                alt={book.title}
                sx={{ objectFit: 'contain', padding: 1 }}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  by {book.author} ({book.year})
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Chip size="small" label={book.genre} />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  height: '60px', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  display: '-webkit-box', 
                  WebkitLineClamp: 3, 
                  WebkitBoxOrient: 'vertical' 
                }}>
                  {book.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', padding: 2 }}>
                <Typography variant="body2">
                  Available: {book.available}/{book.stock}
                </Typography>
                <Button 
                  size="small" 
                  variant="contained" 
                  startIcon={<MenuBookIcon />}
                  disabled={book.available === 0}
                  onClick={() => handleBooking(book)}
                >
                  {book.available > 0 ? "Book Now" : "Unavailable"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No results message */}
      {filteredBooks.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4, p: 3, bgcolor: '#f5f5f5' }}>
          <Typography variant="h6">No books found</Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }}
            onClick={() => {
              setSearchTerm('');
              setGenreFilter('All');
              setAvailabilityFilter('All');
            }}
          >
            Clear filters
          </Button>
        </Box>
      )}

      {/* Booking Dialog */}
      <Dialog
        open={bookingDialogOpen}
        onClose={() => setBookingDialogOpen(false)}
      >
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          {selectedBook && (
            <>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Box sx={{ width: 70, height: 100, mr: 2 }}>
                  <img 
                    src={selectedBook.imageUrl} 
                    alt={selectedBook.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </Box>
                <Box>
                  <Typography variant="h6">{selectedBook.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {selectedBook.author}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Available: {selectedBook.available}/{selectedBook.stock}
                  </Typography>
                </Box>
              </Box>
              <DialogContentText>
                Do you want to book this title? The book will be reserved for you for 48 hours.
              </DialogContentText>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmBooking} 
            variant="contained" 
            disabled={selectedBook && selectedBook.available === 0}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Library;