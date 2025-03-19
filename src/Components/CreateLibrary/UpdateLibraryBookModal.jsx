import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import LibraryServices from "../../Services/LibiraryService.js";

function UpdateLibraryBookModal({ open, handleClose, fetchList, selectedResource }) {
  const [resource, setResource] = useState({
    id: null,
    title: "",
    author: "",
    genre: "",
    year: "",
    description: "",
    imageUrl: "",
    stock: 1,
    available: 1,
  });

  useEffect(() => {
    if (selectedResource) {
      console.log(selectedResource);
      setResource({
        id: selectedResource._id,
        title: selectedResource.title || "",
        author: selectedResource.author || "",
        genre: selectedResource.genre || "",
        year: selectedResource.year || "",
        description: selectedResource.description || "",
        imageUrl: selectedResource.imageUrl || "",
        stock: selectedResource.stock || 1,
        available: selectedResource.available || 1,
      });
    }
  }, [selectedResource]);

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResource((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/file/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      console.log("Upload response:", data);

      setResource((prev) => ({
        ...prev,
        images: URL.createObjectURL(file),  // Show preview
        imageUrl: data.data.filename, // Store uploaded filename
      }));
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleUpdateResource = async () => {
    if (!resource) return; // Ensure a book is selected before updating
    console.log(resource);
    try {
      await LibraryServices.updateLibraryBook(resource.id, resource);
      fetchList();
      handleClose();
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Update Book</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} p={2}>
            <Grid item xs={12}>
              <TextField label="Title" fullWidth size="small" name="title" value={resource.title} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Author" fullWidth size="small" name="author" value={resource.author} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Genre</InputLabel>
                <Select name="genre" value={resource.genre} onChange={handleInputChange}>
                  <MenuItem value="Fantasy">Fantasy</MenuItem>
                  <MenuItem value="Science Fiction">Science Fiction</MenuItem>
                  <MenuItem value="Mystery">Mystery</MenuItem>
                  <MenuItem value="Romance">Romance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Year" fullWidth size="small" name="year" type="number" value={resource.year} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" fullWidth size="small" name="description" value={resource.description} onChange={handleInputChange} required multiline rows={3} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Stock" fullWidth size="small" name="stock" type="number" value={resource.stock} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12}>
              <input
                  accept="image/*"
                  type="file"
                  id="upload-image"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
              />
              <label htmlFor="upload-image">
                <Button variant="outlined" component="span" fullWidth size="small" color="primary">
                  Upload Image
                </Button>
              </label>
              {resource.imageUrl && (
                  <img
                      src={`http://localhost:5000/api/file/${resource.imageUrl}`}
                      alt="Uploaded"
                      style={{
                        marginTop: "10px",
                        width: "100%",
                        maxHeight: "300px",
                        objectFit: "cover",
                      }}
                  />
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">Cancel</Button>
          <Button onClick={handleUpdateResource} variant="contained" color="primary">Update Book</Button>
        </DialogActions>
      </Dialog>
  );
}

export default UpdateLibraryBookModal;
