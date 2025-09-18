import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  act,
} from "@testing-library/react";
import { setupServer } from "msw/node";
import SignUp from "./";
import { handlers } from "./handlers";
import { debug } from "jest-preview";
import { wait } from "@testing-library/user-event/dist/utils";
// Setting up the mock server
const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("SignUp Component", () => {
  describe("Validation", () => {
    it("should display validation errors for invalid email", async () => {
      render(<SignUp />);
      const emailInput = screen.getByLabelText(/Email Address/i);
      act(() => {
        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        fireEvent.blur(emailInput);
      });

      const errorMessage = await screen.findByText(/Enter a valid email/i);
      expect(errorMessage).toBeInTheDocument();
    });

    it("should display validation errors for short password", async () => {
      render(<SignUp />);
      const passwordInput = screen.getByLabelText(/Password/i);
      act(() => {
        fireEvent.change(passwordInput, { target: { value: "short" } });
        fireEvent.blur(passwordInput);
      });
      const errorMessage = await screen.findByText(
        /Password should be of minimum 8 characters length/i
      );
      expect(errorMessage).toBeInTheDocument();
    });

    it("should display success message on successful sign-up", async () => {
      render(<SignUp />);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const usernameInput = screen.getByLabelText(/User Name/i);
      const signUpButton = screen.getByRole("button", {
        name: /Sign Up/i,
      });
      act(() => {
        fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
        fireEvent.change(passwordInput, { target: { value: "ValidPass123!" } });
        fireEvent.change(usernameInput, { target: { value: "ValidUserName" } });
        fireEvent.click(signUpButton);
      });
      const successMessage = await screen.findByText(/Sign Up Successfully!/i);
      expect(successMessage).toBeInTheDocument();
    });

    it("should display error message on sign-up failure", async () => {
      render(<SignUp />);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const usernameInput = screen.getByLabelText(/User Name/i);
      const signUpButton = screen.getByRole("button", { name: /Sign Up/i });
      act(() => {
        fireEvent.change(emailInput, { target: { value: "wrong@gmail.com" } });
        fireEvent.change(passwordInput, { target: { value: "Password!" } });
        fireEvent.change(usernameInput, { target: { value: "Username" } });
        fireEvent.click(signUpButton);
      });
      const errorMessage = await screen.findByText(/Error Signing Up!/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe("Form Interaction", () => {
    it("should enable Sign Up button when form is valid", async () => {
      render(<SignUp />);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const usernameInput = screen.getByLabelText(/User Name/i);
      const signUpButton = screen.getByRole("button", { name: /Sign Up/i });
      act(() => {
        fireEvent.change(emailInput, { target: { value: "TesT@gmail.com" } });
        fireEvent.change(passwordInput, { target: { value: "LongPassword!" } });
        fireEvent.change(usernameInput, { target: { value: "UserName" } });
      });
      await waitFor(() => expect(signUpButton).toBeEnabled());
    });

    it("should disable Sign Up button when form is invalid", async () => {
      render(<SignUp />);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const usernameInput = screen.getByLabelText(/User Name/i);
      const signUpButton = screen.getByRole("button", { name: /Sign Up/i });
      act(() => {
        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        fireEvent.change(passwordInput, { target: { value: "short" } });
        fireEvent.change(usernameInput, { target: { value: "" } });
      });

      await waitFor(() => expect(signUpButton).toBeDisabled());
    });

    it("should update form fields on user input", async () => {
      render(<SignUp />);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const usernameInput = screen.getByLabelText(/User Name/i);
      act(() => {
        fireEvent.change(emailInput, { target: { value: "TesT@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "ValidPass123!" } });
        fireEvent.change(usernameInput, { target: { value: "ValidUserName" } });
      });

      expect(emailInput).toHaveValue("TesT@example.com");
      expect(passwordInput).toHaveValue("ValidPass123!");
      expect(usernameInput).toHaveValue("ValidUserName");
    });

    it("should redirect user to home page after successful signup", async () => {
      render(<SignUp />);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const usernameInput = screen.getByLabelText(/User Name/i);
      const signUpButton = screen.getByRole("button", { name: /Sign Up/i });
      act(() => {
        fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
        fireEvent.change(passwordInput, { target: { value: "ValidPass123!" } });
        fireEvent.change(usernameInput, { target: { value: "ValidUserName" } });
      });
      fireEvent.click(signUpButton);
      await waitForElementToBeRemoved(() =>
        screen.getByRole("button", { name: /Sign Up/i })
      );
    });
  });
});
