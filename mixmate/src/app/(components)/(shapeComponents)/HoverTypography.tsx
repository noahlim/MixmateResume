import styled from "styled-components";
import { Typography } from "@mui/material";

const HoverTypography = ({ isSmallMobileScreen, isTabletScreen, isLargeScreen, children, backgroundColor, alignTo, variant }) => {
  const StyledTypography = styled(Typography)`
  color: #000;
  position: relative;
  text-decoration: none;
  font-family: "Dela Gothic One";
  flex: 1 1 50%; // 너비를 50%로 설정
  padding: 20px;
  z-index: 3;

    &::before {
      background: ${backgroundColor};
      content: "";
      inset: 0;
      position: absolute;
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.5s ease-in-out;
      z-index: -1;
    }

    ${isLargeScreen || isTabletScreen ?
    `&:hover::before {
      transform: scaleX(1);
      transform-origin: left;` : ""
    }}
  `;

  return (
    <StyledTypography
      variant={variant}
      textAlign={alignTo}
      borderColor="red"
    >
      {children}
    </StyledTypography>
  );
};

export default HoverTypography;
