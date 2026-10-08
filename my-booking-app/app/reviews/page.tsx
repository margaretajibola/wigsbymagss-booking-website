// app/reviews/page.tsx

"use client"

import { Grid, Box, TextField, Button, Typography, Card, CardMedia, CardContent} from "@mui/material";
import ImageUpload from "@/components/reviews/ImageUpload";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Review } from "@/types/review";

export default function Reviews() {
    const [review, setReview] = useState("");
    const [image, setImage] = useState<string | null>(null); 
    const [fileName, setFileName] = useState<string | null>(null); 
    const [reviews, setReviews] = useState<Review[]>([]);
    const { user } = useCurrentUser();
    const [, setLoading] = useState(false);

    const isAdmin = user?.role === "admin";

     // Fetch reviews from API
    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await fetch("/api/reviews");
            const data = await res.json();
            setReviews(data);
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        }
    };

    const handlePost = async () => {
        if (!review) {
        alert("Write a review before continuing");
        return;
        }

        setLoading(true);
        try{
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: review, image: image }),
            });
            if (res.ok) {
                setReview(""); // Clear form
                setImage(null); // Clear image
                setFileName(null); // Clear file name
                fetchReviews(); // Refresh reviews list
            } else {
                alert("Failed to post review. Please try again.");
            }
        }catch(error){
            console.error("Error posting review:", error);
            alert("Failed to post review. Please try again.");
        }finally{
            setLoading(false);
        }
    };

    return(
        <Grid container spacing={3} sx={{p: {xs: 2, sm: 4}}}>
            <Grid size={{xs: 12, md: 6}}>
                <Box sx={{p:2}}>
                    {/* Notes Field */}
                    <Typography sx={{color: '#5b3d6b', fontFamily: 'var(--font-italiana), serif', fontSize: '2rem', mb: 1}}>
                        Leave a Review!
                    </Typography>
                    <Box sx={{ mt: 2}}>
                        <TextField
                        sx={{width: {xs: '100%', sm: 350}}}
                        multiline
                        rows={4}
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        />
                    </Box>

                    {/* Upload Image */}
                    <ImageUpload image={image} setImage={setImage} fileName={fileName} setFileName={setFileName}/>

                    {/* Next Button */}
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', width: {xs: '100%', sm: 350} }}>
                        <Button
                        disabled={isAdmin}
                        sx={{backgroundColor:'#8b5e9b', '&:hover': {backgroundColor: '#7a5490'}}}
                        variant="contained"
                        size="large"
                        onClick={handlePost}
                        >
                        Post
                        </Button>
                    </Box>
                </Box>

            </Grid>

            <Grid size={{xs: 12, md: 6}}>
                <Box sx={{ p: 2 }}>
                    {/* Reviews */}
                    <Typography sx={{ color: "#5b3d6b", fontFamily: 'var(--font-italiana), serif', fontSize: '2rem', mb: 1 }}>
                    Customer Reviews
                    </Typography>
                    {reviews.map((r) => (
                    <Card sx={{ maxWidth: 300, mt: 2, border: "1px solid #e8d5f0", borderRadius: 3, backgroundColor: '#f5eefa'}} key={r.id}>
                        {r.image && (
                        <CardMedia
                            component="img"
                            height="180"
                            image={r.image}
                            alt="Customer review"
                        />
                        )}
                        <CardContent>
                            <Typography sx={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', color: '#2d2438', lineHeight: 1.75 }}>{r.text}</Typography>
                        </CardContent>
                    </Card>
                    ))}
                </Box>
            </Grid>
        </Grid>
        
    );
}