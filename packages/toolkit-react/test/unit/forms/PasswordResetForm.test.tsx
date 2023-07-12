import React from "react";
import { expect, describe, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import PasswordResetForm from "../../../src/forms/PasswordResetForm";

describe("forms/PasswordResetForm.jsx", () => {
  const originalLocation = window.location;
  beforeEach(() => {
    window.location = originalLocation;
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

    render(<PasswordResetForm shouldConfirmPassword />);

    const choose = await screen.findByText("Choose a new password");
    expect(choose).toBeDefined();

    const confirm = await screen.findByText("Confirm your new password");
    expect(confirm).toBeDefined();
  });
});
