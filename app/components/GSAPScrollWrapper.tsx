'use client';

// Simplified wrapper: no ScrollSmoother or custom scroll behaviour.
// It just renders children as-is so the whole site uses the browser's
// default scrolling everywhere.

const GSAPScrollWrapper = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default GSAPScrollWrapper;
