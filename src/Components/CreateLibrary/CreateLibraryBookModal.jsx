import React, { useState } from "react";
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

function CreateLibraryBookModal({ open, handleClose, fetchList }) {
  const [resource, setResource] = useState({
    title: "",
    author: "",
    genre: "",
    year: "",
    description: "",
    imageUrl: "",
    stock: 1,
    available: 1,
  });

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

      setResource((prev) => {
        const updatedResource = {
          ...prev,
          images: URL.createObjectURL(file),
          imageUrl: data.data.filename,
        };
        console.log("Updated newEvent (image):", updatedResource);
        return updatedResource;
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };


  const handleCreateResource = async () => {
    try {
      await LibraryServices.addLibraryBook(resource);
      setResource({
        title: "",
        author: "",
        genre: "",
        year: "",
        description: "",
        imageUrl: "",
        stock: 1,
        available: 1,
      });
      handleClose();
      fetchList();
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Book </DialogTitle>
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
            <Grid item xs={6}>
              <TextField label="Stock" fullWidth size="small" name="stock" type="number" value={resource.stock} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Available Copies" fullWidth size="small" name="available" type="number" value={resource.available} onChange={handleInputChange} required />
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
                <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    size="small"
                    color="primary"
                >
                  Upload Image
                </Button>
              </label>
              {resource.images && (
                  <img
                      src={resource.images}
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
          <Button onClick={handleCreateResource} variant="contained" color="primary">Create Book</Button>
        </DialogActions>
      </Dialog>
  );
}

export default CreateLibraryBookModal;
