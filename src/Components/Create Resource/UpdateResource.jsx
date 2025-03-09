import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
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
import ResourceServices from "../../Services/ResourceService";

function UpdateResourceModal({ open, handleClose, fetchList, selectedResource }) {
  const [resource, setResource] = useState({
    name: selectedResource?.name,
    type: selectedResource?.type,
    description: selectedResource?.description,
    image: selectedResource?.image,
    inStock: selectedResource?.inStock, 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResource((prev) => ({ ...prev, [name]: value }));
  };

  const ImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResource((prev) => ({ ...prev, images: URL.createObjectURL(file) }));
    }
  };

  const handleCounterChange = (action) => {
    setResource((prev) => ({
      ...prev,
      inStock:
        action === "increment"
          ? prev.inStock + 1
          : Math.max(0, prev.inStock - 1),
    }));
  };

  const handleCreateResource = async () => {
    console.log("Creating Resource: ", resource);
    try {
      const response = await ResourceServices.updateResource(selectedResource._id, resource);
      handleClose();
      fetchList();
    } catch (error) {
      throw error?.response?.data || new Error("Something went wrong");
    }
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
          image: data.data.filename,
        };
        console.log("Updated newEvent (image):", updatedResource); // Log updated event state
        return updatedResource;
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Resource</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} p={2}>
          {/* Resource Name */}
          <Grid item xs={12}>
            <TextField
              label="Resource Name"
              variant="outlined"
              fullWidth
              size="small"
              name="name"
              value={resource.name}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* Resource Type */}
          <Grid item xs={12}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Resource Type</InputLabel>
              <Select
                name="type"
                value={resource.type}
                onChange={handleInputChange}
                label="Resource Type"
              >
                <MenuItem value="Technical">Technical</MenuItem>
                <MenuItem value="Furniture">Furniture</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Lighting">Lighting</MenuItem>
                <MenuItem value="Audio">Audio</MenuItem>
                <MenuItem value="Visual">Visual</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              size="small"
              name="description"
              value={resource.description}
              onChange={handleInputChange}
              required
              multiline
              rows={3}
            />
          </Grid>

          {/* In Stock (Stepper for stock count) */}
          <Grid item xs={12}>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={() => handleCounterChange("decrement")}
                  disabled={resource.inStock <= 0}
                >
                  -
                </Button>
              </Grid>
              <Grid item>
                <TextField
                  label="In Stock"
                  variant="outlined"
                  type="number"
                  fullWidth
                  size="small"
                  name="inStock"
                  value={resource.inStock}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ width: "100px", textAlign: "center" }}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={() => handleCounterChange("increment")}
                >
                  +
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Upload Image */}
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
        <Button onClick={handleClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleCreateResource}
          variant="contained"
          color="primary"
        >
          Create Resource
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UpdateResourceModal;
