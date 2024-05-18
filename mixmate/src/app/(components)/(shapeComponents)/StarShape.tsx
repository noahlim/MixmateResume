import React from "react";
import { Box } from "@mui/system";

const StarShape = (props) => {
    const {width, height} = props;
    const lineCount = 4; // Number of lines
    const rotationAngles = [0, 90, 45, -45]; // Rotation angles for each line

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                position: "relative",
                width: width, 
                height: height, 
            }}
        >
            {Array.from({ length: lineCount }).map((_, index) => (
                <Box
                    key={index}
                    sx={{
                        position: "absolute",
                        width: "100%",
                        height: "1px", 
                        backgroundColor: "grey",
                        transform: `rotate(${rotationAngles[index]}deg)`,
                        animation: `${'rotate' + index} 30s linear infinite`,
                        [`@keyframes rotate${index}`]: {
                            from: { transform: `rotate(${rotationAngles[index]}deg)` },
                            to: { transform: `rotate(${rotationAngles[index] + 360}deg)` },
                        },
                    }}
                />
            ))}
        </Box>
    );
};

export default StarShape;