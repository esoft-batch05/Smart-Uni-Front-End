import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    Menu,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SearchIcon from '@mui/icons-material/Search';
import {EventNote, Visibility} from "@mui/icons-material";
import {useSelector} from "react-redux";
import {hideLoading, showLoading} from "../../Utils/loadingUtils.js";
import LibraryService from "../../Services/LibiraryService.js";
import CreateLibraryBookModal from "../../Components/CreateLibrary/CreateLibraryBookModal.jsx";
import EditIcon from "@mui/icons-material/Edit.js";
import DeleteIcon from "@mui/icons-material/Delete.js";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {showAlert} from "../../Utils/alertUtils.js";
import UpdateLibraryBookModal from "../../Components/CreateLibrary/UpdateLibraryBookModal.jsx";

// Sample book data
const sampleBooks = [];

function Library() {
    const userRole = useSelector((state) => state.user?.role);
    const [books, setBooks] = useState(sampleBooks);
    const [filteredBooks, setFilteredBooks] = useState(sampleBooks);
    const [searchTerm, setSearchTerm] = useState('');
    const [genreFilter, setGenreFilter] = useState('All');
    const [availabilityFilter, setAvailabilityFilter] = useState('All');
    const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const handleModalOpen = () => setOpenModal(true);
    const handleModalClose = () => setOpenModal(false);
    const handleModalClose2 = () => setOpenEdit(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // Open and Close Menu
    const handleMenuOpen = (event, book) => {
        setAnchorEl(event.currentTarget);
        setSelectedBook(book);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedBook(null);
    };

    // Edit Book
    const handleEdit = () => {
        if (selectedBook) {
            console.log("Editing book:", selectedBook);
            setOpenEdit(true);
        }
        handleMenuClose();
    }

    // Delete Book
    const handleDelete = async () => {
        showLoading();
        handleMenuClose();
        try {
            await LibraryService.deleteLibraryBook(selectedBook?._id);
            showAlert("success", "Resource Deleted!");

            const updatedBooks = books.filter((book) => book._id !== selectedBook?._id);
            setBooks(updatedBooks);
            setFilteredBooks(updatedBooks); // Ensure filtered list is also updated
        } catch (error) {
            showAlert("error", "Something went wrong!");
        } finally {
            hideLoading();
        }
    };


    const handleAttendeesOpen = () => {
        setOpenAttendeesModal(true);
    };
    // Extract unique genres for filter dropdown
    const genres = ['All', ...new Set(books.map(book => book.genre))];


    const getAllLibraryBooks = async () => {
        showLoading();
        try {
            const response = await LibraryService.getAllLibraryBooks();
            setBooks(response?.data || []);
            console.log(books)
        } catch (error) {
            console.error(error);
        } finally {
            hideLoading();
        }
    };
    const getAllPendingLibraryBooks = async () => {
        showLoading();
        try {
            const response = await LibraryService.getAllPendingLibraryBooks();
            console.log("hello", response);

            setSubmissions(response?.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            hideLoading();
        }
    };
    useEffect(() => {
        getAllLibraryBooks();
        getAllPendingLibraryBooks();
    }, []);
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
    const handleBooking = (id) => {
        setSelectedBook(books[id]);
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
        <Box sx={{py: 2}}>
            {/* Filter and search section */}
            <Box sx={{mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2}}>
                <TextField
                    placeholder="Search books..."
                    size="small"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon fontSize="small" sx={{mr: 1}}/>,
                    }}
                    sx={{flexGrow: 1, minWidth: '200px'}}
                />

                <FormControl size="small" sx={{minWidth: '150px'}}>
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

                <FormControl size="small" sx={{minWidth: '150px'}}>
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
            {/* Action Buttons */}
            <Grid item xs={12} sm={12} md={6} sx={{mb: 3}}>
                {userRole === "admin" && (
                    <>
                        <Button
                            variant="outlined"
                            color="warning"
                            sx={{marginRight: 1}}
                            startIcon={<EventNote/>}
                            onClick={handleModalOpen}

                        >
                            Create New Book
                        </Button>

                        <Button
                            variant="outlined"
                            color="warning"
                            sx={{marginRight: 1}}
                            startIcon={<Visibility/>}
                            onClick={handleAttendeesOpen}

                        >
                            Approve Resource Bookings
                        </Button>
                    </>
                )}
            </Grid>
            <Divider sx={{mb: 3}}/>
            <CreateLibraryBookModal
                open={openModal}
                handleClose={handleModalClose}
                fetchList={getAllLibraryBooks}
            />
            <UpdateLibraryBookModal
                open={openEdit}
                handleClose={handleModalClose2}
                fetchList={getAllLibraryBooks}
                selectedResource={selectedBook}
            />
            {/* Book grid */}
            <Grid container spacing={3}>
                {filteredBooks.map((book,index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Card>
                            {/* Menu Button */}
                            {userRole === "admin" && (
                                <>
                                    <Box sx={{display: "flex", justifyContent: "flex-end", p: 1}}>
                                        <IconButton onClick={(event) => handleMenuOpen(event, book)}>
                                            <MoreVertIcon/>
                                        </IconButton>
                                    </Box>

                                    {/* Menu */}

                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem onClick={handleEdit}>
                                            <EditIcon fontSize="small" sx={{mr: 1}}/>
                                            Edit
                                        </MenuItem>
                                        <MenuItem onClick={handleDelete}>
                                            <DeleteIcon fontSize="small" sx={{mr: 1}}/>
                                            Delete
                                        </MenuItem>
                                    </Menu>
                                </>)}

                            <CardMedia
                                component="img"
                                height="200"
                                image={`http://localhost:5000/api/file/${book.imageUrl}`}
                                alt={book.title}
                                sx={{objectFit: "contain", padding: 1}}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="div" noWrap>
                                    {book.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    by {book.author} ({book.year})
                                </Typography>
                                <Chip size="small" label={book.genre}/>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        height: "60px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {book.description}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{justifyContent: "space-between", padding: 2}}>
                                <Typography variant="body2">
                                    Available: {book.stock}
                                </Typography>
                                <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<MenuBookIcon/>}
                                    onClick={()=>{handleBooking(index)}}
                                    disabled={book.available === 0}
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
                <Box sx={{textAlign: 'center', mt: 4, p: 3, bgcolor: '#f5f5f5'}}>
                    <Typography variant="h6">No books found</Typography>
                    <Button
                        variant="outlined"
                        sx={{mt: 2}}
                        onClick={() => {
                            setSearchTerm('');
                            setGenreFilter('All');
                            setAvailabilityFilter('All');
                        }}
                    >
                        Clear filters
                    </Button>
                </Box>
            )
            }

            {/* Booking Dialog */}
            <Dialog
                open={bookingDialogOpen}
                onClose={() => setBookingDialogOpen(false)}
            >
                <DialogTitle>Confirm Booking</DialogTitle>
                <DialogContent>
                    {selectedBook && (
                        <>
                            <Box sx={{display: 'flex', mb: 2}}>
                                <Box sx={{width: 70, height: 100, mr: 2}}>
                                    <img
                                        src={`http://localhost:5000/api/file/${selectedBook.imageUrl}`}
                                        alt={selectedBook.title}
                                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="h6">{selectedBook.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        by {selectedBook.author}
                                    </Typography>
                                    <Typography variant="body2" sx={{mt: 1}}>
                                        Available: {selectedBook.stock}
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

            {/* Snackbar notifications */
            }
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                    sx={{width: '100%'}}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
        ;
}

export default Library;