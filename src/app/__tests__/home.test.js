import { render, screen } from "@testing-library/react";
import HomePage from "../page"; // Suba um nível e acesse 'page.js'

describe("HomePage", () => {
  it("deve renderizar o nome do site", () => {
    render(<HomePage />);
    expect(screen.getByText("Audio Cleaner")).toBeInTheDocument();
  });

  it("deve conter o botão de Login", () => {
    render(<HomePage />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("deve conter o botão de Registrar", () => {
    render(<HomePage />);
    expect(screen.getByText("Registrar")).toBeInTheDocument();
  });
});
