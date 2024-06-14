import React, { useState } from "react";
import styled from "styled-components";
import MenuBarDropdown from "./MenuBarDropdown"; // Import the dropdown component
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import { Cabin } from "next/font/google";

const cabin = Cabin({ subsets: ["latin"] });

// Dynamically import the Link component to prevent server-side rendering
const Link = dynamic(() => import("next/link"), { ssr: false });
const StyledNavLink = styled.div`
  position: relative;
  text-transform: uppercase;
  margin: 20px 0;
  padding: 0px 20px;
  text-decoration: none;
  color: #262626;
  font-family: sans-serif;
  font-size: 18px;
  font-weight: 600;
  transition: color 0.3s;
  z-index: 1;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-top: 2px solid #262626;
    border-bottom: 2px solid #262626;
    transform: scaleY(2);
    opacity: 0;
    transition: transform 0.3s, opacity 0.3s;
  }

  &::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #262626;
    transform: scale(0);
    opacity: 0;
    transition: transform 0.3s, opacity 0.3s;
    z-index: -1;
  }

  &:hover {
    color: #fff;

    &::before {
      transform: scaleY(1);
      opacity: 1;
    }

    &::after {
      transform: scaleY(1);
      opacity: 1;
    }
  }
`;

const NavLink = ({ children, isDropdown, onClick, route, handlePageChange }) => {
  const [isopen, setisopen] = useState(false);

  const handleMouseEnter = () => {
    setisopen(true);
  };

  const handleMouseLeave = () => {
    setisopen(false);
  };

  return (
    <Box
      sx={{ position: "relative", margin:"0px 20px" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={route} passHref>
        <StyledNavLink
          onClick={(e) => {
            e.preventDefault();
            onClick();
          }}
          className={cabin.className}
        >
          {children}
        </StyledNavLink>
      </Link>
      {isDropdown && isopen ? <MenuBarDropdown handlePageChange={handlePageChange}/> : null}
    </Box>
  );
};
export default NavLink;
