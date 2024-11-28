import { render, screen, act } from "@testing-library/react";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Dashboard from "../dashboard/page"; // Importando o componente

jest.mock("../../lib/firebase");
jest.mock("next/navigation");

describe("Dashboard Component", () => {
  let mockPush;

  beforeEach(() => {
    mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });

    // Mock do estado de autenticação
    auth.onAuthStateChanged = jest.fn((callback) => {
      // Simula que há um usuário autenticado
      callback({ email: "testuser@example.com" });
      
      // Retorna uma função de unsubscribe simulada
      return jest.fn();
    });

    auth.signOut.mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state when no user is authenticated", () => {
    auth.onAuthStateChanged = jest.fn((callback) => {
      // Simula que não há usuário autenticado
      callback(null); // Não há usuário
    });

    render(<Dashboard />);

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
    expect(mockPush).toHaveBeenCalledWith("/login"); // Espera que redirecione para o login
  });

  it("renders user dashboard when user is authenticated", () => {
    render(<Dashboard />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Bem-vindo, testuser")).toBeInTheDocument();
  });

  it("navigates to login on logout", async () => {
    render(<Dashboard />);

    const logoutButton = screen.getByText("Sair");
    await act(async () => {
      logoutButton.click(); // Simula o clique no botão "Sair"
    });

    expect(auth.signOut).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/login"); // Espera que redirecione para o login após logout
  });
});
