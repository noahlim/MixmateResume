import styled from "styled-components";
import { Typography } from "@mui/material";
import { Dela_Gothic_One } from "next/font/google";
const delaGothicOne = Dela_Gothic_One({ subsets: ["latin"], weight: "400" });

const StyledTypography = styled(Typography)<{ $isLargeScreen?: boolean, $isTabletScreen?: boolean, background_color?: string }>`
  color: #000;
  position: relative;
  text-decoration: none;
  flex: 1 1 50%; 
  padding: 20px;
  z-index: 3;

  &::before {
    background: ${props => props.background_color};
    content: "";
    inset: 0;
    position: absolute;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.5s ease-in-out;
    z-index: -1;
  }

  ${props => props.$isLargeScreen || props.$isTabletScreen ?
  `&:hover::before {
    transform: scaleX(1);
    transform-origin: left;` : ""
  }}
`;
const HoverTypography = ({ $isSmallMobileScreen, $isTabletScreen, $isLargeScreen, children, backgroundColor, alignTo, variant }) => {
  return (
    <StyledTypography
      $isLargeScreen={$isLargeScreen}
      $isTabletScreen={$isTabletScreen}
      background_color={backgroundColor}
      variant={variant}
      textAlign={alignTo}
      className={delaGothicOne.className}
    >
      {children}
    </StyledTypography>
  );
};
export default HoverTypography;
