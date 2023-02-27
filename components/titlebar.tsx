import { appWindow } from "@tauri-apps/api/window";
import React, { ReactElement, useEffect, useState } from "react";

interface Props {
  children: ReactElement;
}

export default function TitleBar({ children }: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    window.addEventListener("keydown", async (event) => {
      const preventEvent = ["F3", "F7"];
      const preventEventWithControl = ["KeyF", "KeyG"];

      preventEvent.map((item) => {
        if (event.code === item) {
          event.preventDefault();
        }
      });
      preventEventWithControl.map((item) => {
        if (event.code === item && event.ctrlKey) {
          event.preventDefault();
        }
      });

      switch (event.code) {
        case "Escape": {
          await appWindow.close();
          break;
        }
        case "F11": {
          event.preventDefault();
          const isFullscreen = !(await appWindow.isFullscreen());
          setIsFullscreen(isFullscreen);
          await appWindow.setFullscreen(isFullscreen);
          if (isFullscreen) {
            await appWindow.setResizable(false);
          } else {
            await appWindow.setResizable(true);
          }
          break;
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onMinimize() {
    appWindow.minimize();
  }

  function onMaximize() {
    appWindow.toggleMaximize();
  }

  function onClose() {
    appWindow.close();
  }

  if (isFullscreen) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <>
      <div
        data-tauri-drag-region
        className="titlebar"
      >
        <div
          className="titlebar-btn close-btn"
          onClick={onClose}
        >
          Cl
        </div>
        <div
          className="titlebar-btn"
          onClick={onMaximize}
        >
          Ma
        </div>
        <div
          className="titlebar-btn"
          onClick={onMinimize}
        >
          Mi
        </div>
      </div>
      <div className="min-h-[calc(100vh - 32px)] mt-[32px]">{children}</div>
    </>
  );
}
