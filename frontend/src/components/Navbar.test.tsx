import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";

// Mock the Auth Context
jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock react-redux useSelector
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("Navbar Component Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default useSelector implementation returns an empty cart array
    (useSelector as unknown as jest.Mock).mockReturnValue([]);

    // Default useAuth implementation returns no logged-in user
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: null,
      logout: jest.fn(),
    });
  });

  it("renders search input placeholder", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Search here")).toBeInTheDocument();
  });

  it("displays correct number of cart items", () => {
    // Mock cart containing 2 items
    (useSelector as unknown as jest.Mock).mockReturnValue([
      { id: "1", name: "Book A" },
      { id: "2", name: "Book B" },
    ]);

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // The cart notification counter should display "2"
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders user avatar and opens dropdown with dashboard options when clicked", () => {
    // Mock active user
    const mockLogout = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { email: "student@its.ac.id", displayName: "Mahasiswa" },
      logout: mockLogout,
    });

    const { container } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // The user avatar image and its button should render
    const avatarImg = container.querySelector("img");
    const avatarButton = avatarImg?.closest("button");
    expect(avatarButton).toBeInTheDocument();

    // Click the avatar button to trigger dropdown visibility
    fireEvent.click(avatarButton!);

    // Dropdown list options should appear
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();

    // Click logout and verify it executes
    const logoutBtn = screen.getByText("Logout");
    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
