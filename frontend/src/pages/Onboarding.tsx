import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { useSwipeable } from "react-swipeable";
import Spline from "@splinetool/react-spline";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    title: "Welcome to AURA",
    description: "Your personal air quality companion for healthier living",
    image: "/assets/onboarding-1.svg",
  },
  {
    title: "Real-time Air Quality",
    description: "Get instant updates on air quality in your area",
    image: "/assets/onboarding-2.svg",
  },
  {
    title: "Plan Safe Routes",
    description: "Find the healthiest routes for your daily commute",
    image: "/assets/onboarding-3.svg",
  },
];

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      currentSlide < slides.length - 1 && setCurrentSlide((prev) => prev + 1),
    onSwipedRight: () =>
      currentSlide > 0 && setCurrentSlide((prev) => prev - 1),
  });

  const handleGrantPermission = () => {
    // Handle permission logic here
    navigate("/login");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      {...handlers}
      sx={{
        bgcolor: "black",
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          pl: 8,
          pr: 4,
          gap: 4,
          position: "relative",
          paddingBlockEnd: "6rem",
          left: "3rem",
          zIndex: 10,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "4rem", lg: "4.5rem" },
                fontWeight: 700,
                lineHeight: 1.2,
                background: "linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {slides[currentSlide].title}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                maxWidth: "600px",
                mb: 2,
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              {slides[currentSlide].description}
            </Typography>
          </motion.div>
        </AnimatePresence>

        <Box sx={{ display: "flex", gap: 1, mb: 4 }}>
          {slides.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                cursor: "pointer",
                bgcolor:
                  index === currentSlide
                    ? "#2196f3"
                    : "rgba(255, 255, 255, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.2)",
                  bgcolor:
                    index === currentSlide
                      ? "#2196f3"
                      : "rgba(255, 255, 255, 0.5)",
                },
              }}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={handleGrantPermission}
          sx={{
            width: "fit-content",
            py: 1.5,
            px: 4,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1.1rem",
            background: "linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)",
            boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
          }}
        >
          Get Started
        </Button>
      </Box>

      <Box
        sx={{
          flex: 1,
          position: "relative",
          height: "100%",
        }}
      >
        <Spline
          scene="https://prod.spline.design/Flk4RMU7PH-ynWtv/scene.splinecode"
          style={{ width: "100%", height: "100%" }}
        />
      </Box>
    </Box>
  );
};

export default Onboarding;

{
  /* <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Box
                component="img"
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                sx={{ width: "100%", maxWidth: 300, mb: 4 }}
              />
              <Typography variant="h4" gutterBottom>
                {slides[currentSlide].title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {slides[currentSlide].description}
              </Typography>
            </Box>
          </motion.div>
        </AnimatePresence>

        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          {slides.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: index === currentSlide ? "primary.main" : "grey.300",
              }}
            />
          ))}
        </Box>

        {currentSlide === slides.length - 1 ? (
          <Button
            variant="contained"
            size="large"
            onClick={handleGrantPermission}
            sx={{ width: "100%", maxWidth: 300 }}
          >
            Grant Permission
          </Button>
        ) : (
          <Button
            variant="contained"
            size="large"
            onClick={() => setCurrentSlide((prev) => prev + 1)}
            sx={{ width: "100%", maxWidth: 300 }}
          >
            Next
          </Button>
        )}
      </Box> */
}
