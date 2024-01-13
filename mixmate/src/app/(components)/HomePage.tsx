function HomePage() {
    // useEffect(() => {
    //   addMeetupHandler();
    // }, []);
    const backgroundImage = {
      backgroundImage: `url(/HomePage.png)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
    };
  
    return <div style={backgroundImage}></div>;
  }

  export default HomePage;