import React from "react";
import styled from "styled-components";

interface FloatingProps {
  $isSmallMobileScreen: boolean;
  $isTabletScreen: boolean;
  $isMediumMobileScreen: boolean;
}

const FloatingBoxWrapper: React.FC<FloatingProps> = (props) => {
  return (
    <>
      <FloatingImage {...props} />
      <FloatingBox {...props} />;
    </>
  );
};
const FloatingBox = styled.div<FloatingProps>`
  width: ${(props) =>
    props.$isSmallMobileScreen
      ? props.$isTabletScreen
        ? "370px"
        : "200px"
      : "30%"};
  border: 2px lightgrey solid;
  height: ${(props) => (props.$isMediumMobileScreen ? "450px" : "360px")};
  margin: ${(props) => (props.$isSmallMobileScreen ? "40px" : "20px")};
  position: absolute;
  border-radius: 8%;
  bottom: ${(props) =>
    props.$isSmallMobileScreen
      ? "100px"
      : props.$isTabletScreen
      ? "100px"
      : "300px"}
  left: ${(props) =>
    props.$isSmallMobileScreen ? null : props.$isTabletScreen ? null : null};
  transform: rotate(-20deg);
`;

const FloatingImage = styled.img<FloatingProps>`
  width: ${(props) =>
    props.$isSmallMobileScreen
      ? props.$isTabletScreen
        ? "370px"
        : "200px"
      : "30%"};
  border: 2px white solid;
  height: ${(props) => (props.$isMediumMobileScreen ? "450px" : "360px")};
  margin: ${(props) => (props.$isSmallMobileScreen ? "40px" : "20px")};
  position: absolute;
  border-radius: 8%;
  bottom: ${(props) =>
    props.$isSmallMobileScreen
      ? "100px"
      : props.$isTabletScreen
      ? "100px"
      : "300px"}
    left: ${(props) =>
      props.$isSmallMobileScreen ? null : props.$isTabletScreen ? null : null};
  transform: rotate(-7deg);
  opacity: 0.3;
`;

export default FloatingBoxWrapper;
