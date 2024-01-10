function layout ({ children })  {
  return (
    <>
      <h1>I am a header</h1>
      {children}
      <h1>I am a footer</h1>
    </>
  );
};
export default layout;