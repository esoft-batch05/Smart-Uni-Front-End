import React, { useEffect, useState } from "react";
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
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  DialogActions,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import InventoryIcon from "@mui/icons-material/Inventory";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import ResourceServices from "../../Services/ResourceService";
import { hideLoading, showLoading } from "../../Utils/loadingUtils";
import { showAlert } from "../../Utils/alertUtils";
import UpdateResourceModal from "../Create Resource/UpdateResource";
import dayjs from "dayjs";
import EventServices from "../../Services/EventService";

// Styled components for better visuals
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  maxWidth: "340px", // More compact width
  margin: "0 auto", // Center the card if in a container larger than card
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[10],
  },
  borderRadius: "12px",
  overflow: "hidden",
}));

const ResourceMedia = styled(CardMedia)(({ theme }) => ({
  paddingTop: "56.25%", // 16:9 aspect ratio (responsive)
  position: "relative",
  backgroundSize: "cover",
  backgroundPosition: "center",
  [theme.breakpoints.down("sm")]: {
    paddingTop: "75%", // Taller on mobile for better visibility
  },
}));

const ResourceBadge = styled(Chip)(({ theme, available }) => ({
  position: "absolute",
  top: 12,
  right: 12,
  fontWeight: "bold",
  fontSize: "0.75rem",
  height: "24px",
  backgroundColor: available
    ? theme.palette.success.main
    : theme.palette.error.main,
  color: theme.palette.common.white,
}));

const ResourceContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2), // Reduced padding
}));

const ResourceInfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(0.75), // Reduced spacing
  "& svg": {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
    fontSize: "1rem", // Smaller icons
  },
}));

const BookButton = styled(Button)(({ theme, available }) => ({
  marginTop: theme.spacing(1.5),
  fontWeight: "bold",
  width: "100%",
  padding: theme.spacing(0.75, 1.5), // Smaller button height
}));

const CardHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  width: "100%",
  marginBottom: theme.spacing(0.5),
}));

function ResourceCard({ resource, onBookItem, onEdit, fetchList }) {
  const userRole = useSelector((state) => state.user?.role);
  const userId = useSelector((state) => state.user?._id);
  const isAdmin = userRole === "admin";

  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openModal, setOpenModal] = useState(false);
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [handoverDate, setHandoverDate] = useState(null);
  const handleBookClick = () => setOpenBookingModal(true);
  const handleCloseBookingModal = () => setOpenBookingModal(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getApprovedEvents = async () => {
    const response = await EventServices.getAllApprovedEvents();
    setApprovedEvents(response?.data);
  };

  useEffect(() => {
    getApprovedEvents();
  }, []);

  const handleEdit = () => {
    handleMenuClose();
    handleModalOpen();
    if (onEdit && typeof onEdit === "function") {
      onEdit(resource);
    }
  };

  const handleDelete = async () => {
    showLoading();
    handleMenuClose();
    try {
      const response = ResourceServices.deleteResource(resource?._id);
      showAlert("success", "Resource Deleted!");
      fetchList();
    } catch (error) {
      showAlert("error", "something went wrong!");
    } finally {
      hideLoading();
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedEvent || !handoverDate) {
      alert("Please select an event and handover date.");
      return;
    }

    const bookingData = {
      eventId: selectedEvent,
      handoverDate: dayjs(handoverDate).format("YYYY-MM-DD"),
      userId: userId,
    };

    console.log("Booking confirmed:", bookingData);
    showLoading();

    try {
      const response = await ResourceServices.bookResource(
        resource._id,
        bookingData
      );
      fetchList();
      if (response?.data?.status === "approved") {
        showAlert("success", "Resource Booked!");
      } else if (response?.data?.status === "pending") {
        showAlert(
          "success",
          "Your Booking is under review and approval is pending. It will be approved within 24 hours after review."
        );
      }
    } catch (error) {
      showAlert("error", "something went wrong");
    } finally {
      hideLoading();
      handleCloseBookingModal();
    }
  };

  return (
    <Box>
      <StyledCard>
        <ResourceMedia
          image={`http://localhost:5000/api/file/${resource.image}`}
          title={resource.name}
        >
          <ResourceBadge
            label={resource.availability ? "Available" : "Out of Stock"}
            available={resource.availability ? 1 : 0}
            size="small"
          />
        </ResourceMedia>

        <ResourceContent>
          <CardHeader>
            <Typography
              variant="h6"
              component="div"
              fontWeight="bold"
              sx={{
                mb: 0,
                pr: 1,
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {resource.name}
            </Typography>

            {isAdmin && (
              <>
                <IconButton
                  size="small"
                  aria-label="more"
                  aria-controls="resource-menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  sx={{ ml: "auto" }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>

                <Menu
                  id="resource-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Edit" />
                  </MenuItem>
                  <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Delete" />
                  </MenuItem>
                </Menu>
              </>
            )}
          </CardHeader>

          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{
              mb: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.3,
            }}
          >
            {resource.description}
          </Typography>

          <Divider sx={{ my: 1 }} />

          <ResourceInfoItem>
            <CameraAltIcon fontSize="small" />
            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
              Type: <strong>{resource.type}</strong>
            </Typography>
          </ResourceInfoItem>

          <ResourceInfoItem>
            <InventoryIcon fontSize="small" />
            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
              In Stock: <strong>{resource.inStock} units</strong>
            </Typography>
          </ResourceInfoItem>

          <ResourceInfoItem>
            <EventAvailableIcon fontSize="small" />
            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
              Status:{" "}
              <strong>
                {resource.availability
                  ? "Ready to Book"
                  : "Currently Unavailable"}
              </strong>
            </Typography>
          </ResourceInfoItem>

          <BookButton
            variant="contained"
            color="primary"
            startIcon={<BookmarkAddIcon />}
            onClick={handleBookClick}
            disabled={!resource.availability || resource.inStock === 0}
            size="small"
          >
            {resource.availability ? "Book This Item" : "Currently Unavailable"}
          </BookButton>
        </ResourceContent>
      </StyledCard>
      <UpdateResourceModal
        selectedResource={resource}
        open={openModal}
        handleClose={handleModalClose}
        fetchList={fetchList}
      />

      <Dialog open={openBookingModal} onClose={handleCloseBookingModal}>
        <DialogTitle>Book Resource</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }} size="small">
            <InputLabel>Select Event</InputLabel>
            <Select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              label="Select Event"
            >
              {approvedEvents.map((event, index) => (
                <MenuItem key={index} value={event._id}>
                  {" "}
                  {event.name}{" "}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body2" sx={{ mt: 2, ml: 1, width: "500px" }}>
            Handover Date
          </Typography>
          <TextField
            sx={{ mt: 0.5 }}
            variant="outlined"
            type="date"
            fullWidth
            size="small"
            name="date"
            value={handoverDate}
            onChange={(e) => setHandoverDate(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBookingModal} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmBooking}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export { ResourceCard };
export default ResourceCard;
