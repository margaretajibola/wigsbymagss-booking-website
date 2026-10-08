// components/ImageUpload.tsx

import React from "react";
import { Box, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface ImageUploadProps {
  image: string | null;
  setImage: (image: string | null) => void;
  fileName: string | null;
  setFileName: (fileName: string | null) => void;
}


const ImageUpload: React.FC<ImageUploadProps> = ({ setImage, fileName, setFileName }) =>  {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFileName(file.name); //preview

      // Convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string); // This will be base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "left", mt:2 }}>
      <input
        accept="image/*"
        type="file"
        id="upload-image"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
      <label htmlFor="upload-image">
        <Button
        variant="contained"
        component="span"
        startIcon={<CloudUploadIcon />}
        sx={{
            backgroundColor: "#6a1b9a", // purple
            "&:hover": { backgroundColor: "#4a148c" }, // darker on hover
            borderRadius: "30px",
            textTransform: "none", // keep normal text
        }}
        >
        </Button>
      </label>
      <Typography sx={{color:"gray", fontSize: "0.75rem"}}>
        UPLOAD IMAGE
      </Typography>

      {fileName && (
        <Typography sx={{ mt: 2, color: "black", fontSize: "0.9rem" }}>
          Selected: {fileName}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUpload;
