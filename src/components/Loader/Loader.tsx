export const SquareLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="spinner relative w-[70.4px] h-[70.4px] animate-spinner transform-style-preserve-3d">
        <div className="spinner-face"></div>
        <div className="spinner-face"></div>
        <div className="spinner-face"></div>
        <div className="spinner-face"></div>
        <div className="spinner-face"></div>
        <div className="spinner-face"></div>
      </div>
    </div>
  );
};

export const PyramidLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="pyramid-loader">
        <div className="wrapper">
          <span className="side side1"></span>
          <span className="side side2"></span>
          <span className="side side3"></span>
          <span className="side side4"></span>
          <span className="shadow"></span>
        </div>
      </div>
    </div>
  );
};

export const DotLoader = () => {
  return (
    <section className="dots-container">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </section>
  );
};
