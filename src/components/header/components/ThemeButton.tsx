import { ActionButton } from "@galacean/editor-ui";
import { HalfMoon, SunLight } from 'iconoir-react';
import React, { useContext } from "react";
import { AppContext } from "../../contextProvider";

export default function ThemeButton() {
  const context = useContext(AppContext);

  React.useEffect(() => {
    document.body.classList.remove("dark-theme", "light-theme");
    document.body.classList.add(`${context.theme}-theme`);
  }, [context.theme]);

  return <ActionButton onClick={() => {
    const newTheme = context.theme === "dark" ? "light" : "dark"
    context.setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }}>
    {context.theme === "dark" ? <HalfMoon /> : <SunLight />}
  </ActionButton>
}