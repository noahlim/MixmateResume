import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  Link,
} from "@mui/material";
import {
  FaGithub,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";
import { BiDrink } from "react-icons/bi";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About", href: "#" },
      { name: "Team", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press", href: "#" },
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
    ],
    resources: [
      { name: "Blog", href: "#" },
      { name: "Recipes", href: "#" },
      { name: "Mixology Guide", href: "#" },
      { name: "Events", href: "#" },
    ],
    contact: [
      { name: "Contact Us", href: "#" },
      { name: "Support", href: "#" },
      { name: "Partnership", href: "#" },
      { name: "Feedback", href: "#" },
    ],
  };

  const socialLinks = [
    {
      icon: <FaGithub />,
      href: "https://github.com/harryGIbong",
      label: "GitHub",
    },
    { icon: <FaFacebook />, href: "#", label: "Facebook" },
    { icon: <FaInstagram />, href: "#", label: "Instagram" },
    { icon: <FaYoutube />, href: "#", label: "YouTube" },
    { icon: <FaTwitter />, href: "#", label: "Twitter" },
  ];

  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, rgba(26,26,46,0.97) 60%, #23243a 100%)",
        backdropFilter: "blur(24px)",
        borderTop: "4px solid #ffd700",
        boxShadow: "0 -8px 32px 0 #ffd70022",
        mt: "auto",
        position: "relative",
        zIndex: 10,
      }}
    >
      <Container maxWidth="xl">
        {/* Main Footer Content */}
        <Box sx={{ py: 6 }}>
          <Grid container spacing={4}>
            {/* Brand Section */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                    position: "relative",
                  }}
                >
                  <BiDrink
                    size={36}
                    color="#ffd700"
                    style={{
                      filter: "drop-shadow(0 4px 16px #ffd70088)",
                      animation: "bounce 2s infinite",
                    }}
                  />
                  <Typography
                    variant="h5"
                    className="text-gradient font-display font-bold"
                    sx={{
                      fontWeight: 700,
                      color: "#ffd700",
                      letterSpacing: 1,
                      fontSize: "2rem",
                      position: "relative",
                    }}
                  >
                    MixMate
                    <Box
                      sx={{
                        width: 80,
                        height: 4,
                        background:
                          "linear-gradient(90deg, #ffd700 60%, #fffbe6 100%)",
                        borderRadius: 99,
                        mx: "auto",
                        mt: 1,
                      }}
                    />
                  </Typography>
                  {/* Fun confetti/cocktail icon */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: 80,
                      top: -10,
                      zIndex: 2,
                      animation: "bounce 2s infinite",
                    }}
                  >
                    <BiDrink
                      size={24}
                      color="#ffd700"
                      style={{ filter: "drop-shadow(0 2px 8px #ffd70088)" }}
                    />
                  </Box>
                </Box>
                <Typography
                  className="text-base font-primary"
                  sx={{
                    color: "var(--gray-300)",
                    mb: 3,
                    lineHeight: 1.7,
                    fontWeight: 400,
                  }}
                >
                  Your ultimate cocktail companion. Discover, create, and share
                  amazing cocktail recipes with fellow mixology enthusiasts.
                </Typography>

                {/* Contact Info */}
                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 1,
                    }}
                  >
                    <MdEmail color="var(--accent-gold)" />
                    <Typography
                      className="font-primary"
                      sx={{
                        color: "var(--gray-300)",
                        fontSize: "0.9rem",
                        fontWeight: 400,
                      }}
                    >
                      hello@mixmate.com
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 1,
                    }}
                  >
                    <MdPhone color="var(--accent-gold)" />
                    <Typography
                      className="font-primary"
                      sx={{
                        color: "var(--gray-300)",
                        fontSize: "0.9rem",
                        fontWeight: 400,
                      }}
                    >
                      +1 (555) 123-4567
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <MdLocationOn color="var(--accent-gold)" />
                    <Typography
                      className="font-primary"
                      sx={{
                        color: "var(--gray-300)",
                        fontSize: "0.9rem",
                        fontWeight: 400,
                      }}
                    >
                      Toronto, Canada
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Links Sections */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography
                variant="h6"
                className="font-primary"
                sx={{
                  color: "var(--white)",
                  fontWeight: 600,
                  mb: 3,
                  fontSize: "1.1rem",
                }}
              >
                Company
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {footerLinks.company.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="font-primary"
                    sx={{
                      color: "var(--gray-300)",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      transition: "color 0.2s ease",
                      "&:hover": {
                        color: "var(--accent-gold)",
                      },
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Typography
                variant="h6"
                className="font-primary"
                sx={{
                  color: "var(--white)",
                  fontWeight: 600,
                  mb: 3,
                  fontSize: "1.1rem",
                }}
              >
                Support
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {footerLinks.support.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="font-primary"
                    sx={{
                      color: "var(--gray-300)",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      transition: "color 0.2s ease",
                      "&:hover": {
                        color: "var(--accent-gold)",
                      },
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Typography
                variant="h6"
                className="font-primary"
                sx={{
                  color: "var(--white)",
                  fontWeight: 600,
                  mb: 3,
                  fontSize: "1.1rem",
                }}
              >
                Resources
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {footerLinks.resources.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="font-primary"
                    sx={{
                      color: "var(--gray-300)",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      transition: "color 0.2s ease",
                      "&:hover": {
                        color: "var(--accent-gold)",
                      },
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Typography
                variant="h6"
                className="font-primary"
                sx={{
                  color: "var(--white)",
                  fontWeight: 600,
                  mb: 3,
                  fontSize: "1.1rem",
                }}
              >
                Contact
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {footerLinks.contact.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="font-primary"
                    sx={{
                      color: "var(--gray-300)",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      transition: "color 0.2s ease",
                      "&:hover": {
                        color: "var(--accent-gold)",
                      },
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Divider */}
        <Divider sx={{ borderColor: "#ffd700", opacity: 0.3, my: 3 }} />

        {/* Bottom Section */}
        <Box sx={{ py: 3 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={12} sm={6}>
              <Typography
                className="font-primary"
                sx={{
                  color: "#ffd700",
                  fontSize: "1rem",
                  textAlign: { xs: "center", sm: "left" },
                  fontWeight: 600,
                  letterSpacing: 1,
                  textShadow: "0 2px 8px #ffd70033",
                }}
              >
                © {currentYear} MixMate. All rights reserved. Created by Noah
                Lim
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", sm: "flex-end" },
                  gap: 1,
                  mt: { xs: 2, sm: 0 },
                }}
              >
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: "#ffd700",
                      background: "rgba(26,26,46,0.85)",
                      border: "1.5px solid #ffd70033",
                      boxShadow: "0 2px 8px #ffd70022",
                      backdropFilter: "blur(12px)",
                      fontSize: 28,
                      mx: 0.5,
                      transition: "all 0.2s",
                      "&:hover": {
                        color: "#23243a",
                        background:
                          "linear-gradient(90deg, #ffd700 60%, #fffbe6 100%)",
                        transform: "translateY(-2px) scale(1.15)",
                        boxShadow: "0 4px 16px #ffd70044",
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
