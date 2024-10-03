import React from 'react';

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[768px] min-h-screen px-8 md:px-0 flex flex-col items-center justify-center">
      {children}
    </div>
  );
}
