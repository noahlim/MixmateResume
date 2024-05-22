import { Box, Typography } from "@mui/material";

export const metadata = {
  title: "MixMate | About",
  description: "Description test",
};

function Page() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", height: "100vh" }}>
      <Box border={3} sx={{ width: { md: "70%", xs: "90%" } }}>
        <Typography variant="h2">
          Introducing MixMate: The Ultimate Cocktail Companion
        </Typography>
        <Typography>
          MixMate is a cutting-edge web application that promises to
          revolutionize the way people discover, create, and share cocktail
          recipes. Born out of a deep-rooted passion for mixology and driven by
          a vision to empower cocktail enthusiasts worldwide, MixMate is poised
          to become the go-to platform for anyone who appreciates the art of
          crafting unique and delicious cocktails.
        </Typography>
        <Typography>
          At its core, MixMate boasts an extensive and meticulously curated
          database of over 280 cocktail recipes, catering to every taste and
          occasion. With advanced filtering capabilities, users can effortlessly
          search for recipes based on various criteria, such as alcohol content,
          glass type, drink category (shaken, stirred, cocktail, shot, etc.),
          and specific ingredients. Whether you're a seasoned mixologist seeking
          inspiration or a novice embarking on a flavorful journey, MixMate
          offers a treasure trove of recipes that will tantalize your taste buds
          and ignite your creativity.
        </Typography>
        <Typography variant="h2">
          Introducing MixMate: The Ultimate Cocktail Companion
        </Typography>
        <Typography>
          One of the standout features of MixMate is its innovative cocktail
          creation tool. With an intuitive interface, users can effortlessly
          input the ingredients they have on hand, and the application will
          suggest a variety of cocktail recipes tailored to their preferences
          and available ingredients. This groundbreaking feature encourages
          experimentation and fosters a sense of creativity, allowing users to
          craft truly personalized and unique cocktails that reflect their
          individual tastes and styles. Moreover, MixMate empowers users to
          become creators themselves by providing the ability to create and
          share their own original cocktail recipes with the vibrant community.
        </Typography>
        <Typography>
          But MixMate is more than just a recipe repository; it's a vibrant
          community where cocktail enthusiasts from around the world can
          connect, share their creations, and engage in lively discussions about
          their favorite drinks. Users can rate and review recipes, leaving
          feedback and suggestions that contribute to the continuous improvement
          and evolution of the platform. This collaborative approach ensures
          that MixMate remains a dynamic and ever-growing resource, constantly
          adapting to the changing tastes and trends of the cocktail world.
        </Typography>
        <Typography variant="h2">More Than Just a Cocktail App </Typography>
        <Typography>
          MixMate is not just another cocktail app; it's a platform that
          celebrates the art of mixology, fosters creativity, and brings
          together a community of passionate individuals who share a love for
          well-crafted cocktails. With its extensive recipe database, advanced
          filtering capabilities, and user-generated content, MixMate offers a
          truly immersive and personalized experience for cocktail enthusiasts
          of all levels. Join us on this flavorful journey and let MixMate be
          your trusted companion in discovering, creating, and sharing the
          perfect cocktail for any occasion, whether it's a casual gathering
          with friends or a sophisticated soiree.
        </Typography>
      </Box>
    </Box>
  );
}

export default Page;
