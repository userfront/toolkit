import React from "react";
import { vi, expect, describe, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import PasswordResetForm from "../../../src/forms/PasswordResetForm";
import { getUserfrontPropertySync } from "../../../src/services/userfront";

vi.mock("../../../src/services/userfront", () => {
  return {
    getUserfrontPropertySync: vi.fn(),
  };
});

describe("forms/PasswordResetForm.jsx", () => {
  const originalLocation = window.location;
  beforeEach(() => {
    window.location = originalLocation;
    vi.mocked(getUserfrontPropertySync).mockReturnValue({
      hasRole: vi.fn(),
      update: vi.fn(),
      updatePassword: vi.fn(),
    });
  });
  it("should show the 'request password reset' form if no query params are present", async () => {
    render(<PasswordResetForm />);

    const result = await screen.findByText("Get reset link");
    expect(result).toBeDefined();
  });

  it("should show the 'set new password' form if link credentials are present in query params", async () => {
    // @ts-ignore
    window.location = new URL(
      "https://www.example.com/reset?uuid=some-uuid&token=some-token"
    );

    render(<PasswordResetForm />);

    const result = await screen.findByText("Choose a new password");
    expect(result).toBeDefined();
  });

  it("should show the 'set new password' form without the confirm field if link credentials are present", async () => {
    // @ts-ignore
    window.location = new URL(
      "https://www.example.com/reset?uuid=some-uuid&token=some-token"
    );

    render(<PasswordResetForm shouldConfirmPassword={false} />);

    const choose = await screen.findByText("Choose a new password");
    expect(choose).toBeDefined();

    const result = await screen.queryByText("Confirm your new password");
    expect(result).toBeFalsy();
  });

  it("should show the 'set new password' form with the confirm field if link credentials are present and shouldConfirmPassword=true", async () => {
    // @ts-ignore
    window.location = new URL(
      "https://www.example.com/reset?uuid=some-uuid&token=some-token"
    );

    render(<PasswordResetForm />);

    const choose = await screen.findByText("Choose a new password");
    expect(choose).toBeDefined();

    const confirm = await screen.findByText("Confirm your new password");
    expect(confirm).toBeDefined();
  });

  it("should show the 'set new password' form if a user is logged in", async () => {
    vi.mocked(getUserfrontPropertySync).mockReturnValue({
      hasRole: vi.fn(),
      update: vi.fn(),
      updatePassword: vi.fn(),
      mode: "live",
      tenantId: "abcd1234",
      userId: 1,
      userUuid: "d6f0f045-f6ea-4262-8724-dfc0b77e7dc9",
      email: "test@example.com",
      name: "Test User",
    });

    render(<PasswordResetForm />);

    const result = await screen.findByText("Choose a new password");
    expect(result).toBeDefined();
  });
});
