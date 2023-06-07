const mockUserfront = {
  _logAllMethodCalls: false,
  _requireMfa: false,
  store: {
    tenantId: "demo1234",
  },
  login: async () => {
    return {
      mode: "test",
      message: "OK",
      redirectTo: "https://example.com/path",
      sessionId: "8976836f-f43d-425d-ab93-86e620c51e5c",
      nonce: "71539dd5-7efc-43d1-b355-9c7e48f165b5",
      tokens: {
        access: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 7,
          },
        },
        id: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 7,
          },
        },
        refresh: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 1,
          },
        },
      },
      userId: 5,
      tenantId: "demo1234",
      userUuid: "a9c9b41c-ce76-4f7e-915a-abf18a36a4ae",
      username: "janedoe",
      email: "user@example.com",
      phoneNumber: "+15558675309",
      name: "Jane Doe",
      image:
        "https://res.cloudinary.com/component/image/upload/avatars/avatar-16.png",
      locked: false,
      data: {
        custom: "data",
      },
      isConfirmed: true,
      isMfaRequired: false,
      lastActiveAt: "2022-12-15T23:36:33.299Z",
      lastMessagedAt: "2022-12-15T16:15:14.372Z",
      confirmedAt: "2022-12-15T06:33:43.416Z",
      createdAt: "2022-12-13T20:21:45.837Z",
      updatedAt: "2022-12-16T00:06:45.138Z",
      tenant: {
        tenantId: "demo1234",
        name: "Demo Account",
      },
      authentication: {
        firstFactors: [
          {
            strategy: "password",
            channel: "email",
          },
          {
            strategy: "link",
            channel: "email",
          },
          {
            strategy: "google",
            channel: "email",
          },
        ],
        secondFactors: [
          {
            strategy: "totp",
            channel: "authenticator",
          },
        ],
      },
      authorization: {
        demo1234: {
          roles: [],
        },
      },
    };
  },
  signup: async () => {
    return {
      mode: "test",
      message: "OK",
      redirectTo: "https://example.com/path",
      sessionId: "8976836f-f43d-425d-ab93-86e620c51e5c",
      nonce: "71539dd5-7efc-43d1-b355-9c7e48f165b5",
      tokens: {
        access: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 7,
          },
        },
        id: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 7,
          },
        },
        refresh: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 1,
          },
        },
      },
      userId: 5,
      tenantId: "demo1234",
      userUuid: "a9c9b41c-ce76-4f7e-915a-abf18a36a4ae",
      username: "janedoe",
      email: "user@example.com",
      phoneNumber: "+15558675309",
      name: "Jane Doe",
      image:
        "https://res.cloudinary.com/component/image/upload/avatars/avatar-16.png",
      locked: false,
      data: {
        custom: "data",
      },
      isConfirmed: true,
      isMfaRequired: false,
      lastActiveAt: "2022-12-15T23:36:33.299Z",
      lastMessagedAt: "2022-12-15T16:15:14.372Z",
      confirmedAt: "2022-12-15T06:33:43.416Z",
      createdAt: "2022-12-13T20:21:45.837Z",
      updatedAt: "2022-12-16T00:06:45.138Z",
      tenant: {
        tenantId: "demo1234",
        name: "Demo Account",
      },
      authentication: {
        firstFactors: [
          {
            strategy: "password",
            channel: "email",
          },
          {
            strategy: "link",
            channel: "email",
          },
          {
            strategy: "google",
            channel: "email",
          },
        ],
        secondFactors: [
          {
            strategy: "totp",
            channel: "authenticator",
          },
        ],
      },
      authorization: {
        demo1234: {
          roles: [],
        },
      },
    };
  },
  sendVerificationCode: async () => {
    return {};
  },
  logout: async () => {
    return {
      message: "OK",
      redirectTo: "https://example.com/path",
    };
  },
  redirectIfLoggedIn: async () => {
    return undefined;
  },
  resetPassword: async () => {
    return {
      mode: "test",
      message: "OK",
      redirectTo: "https://example.com/path",
      sessionId: "8976836f-f43d-425d-ab93-86e620c51e5c",
      nonce: "71539dd5-7efc-43d1-b355-9c7e48f165b5",
      tokens: {
        access: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 7,
          },
        },
        id: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 7,
          },
        },
        refresh: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 1,
          },
        },
      },
    };
  },
  updatePassword: async () => {
    return {
      mode: "test",
      message: "OK",
      redirectTo: "https://example.com/path",
      sessionId: "8976836f-f43d-425d-ab93-86e620c51e5c",
      nonce: "71539dd5-7efc-43d1-b355-9c7e48f165b5",
      tokens: {
        access: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 7,
          },
        },
        id: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 7,
          },
        },
        refresh: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 1,
          },
        },
      },
    };
  },
  sendLoginLink: async () => {
    return {
      message: "OK",
      result: {
        email: "user@example.com",
        submittedAt: "2022-12-16T00:08:26.172Z",
        messageId: "ed2052f6-da85-48aa-a24e-3eab4c5b08d0",
      },
    };
  },
  sendResetLink: async () => {
    return {
      message: "OK",
      result: {
        email: "user@example.com",
        submittedAt: "2022-12-16T00:08:26.172Z",
        messageId: "ed2052f6-da85-48aa-a24e-3eab4c5b08d0",
      },
    };
  },
  setMode: async () => {
    return {
      mode: "live",
      authentication: {
        firstFactors: [
          { channel: "email", strategy: "link" },
          { channel: "email", strategy: "azure" },
          { channel: "email", strategy: "verificationCode" },
          { channel: "email", strategy: "password" },
          { channel: "sms", strategy: "verificationCode" },
          { channel: "email", strategy: "google" },
          { channel: "email", strategy: "apple" },
          { channel: "email", strategy: "github" },
          { channel: "email", strategy: "okta" },
        ],
      },
    };
  },
};

export default mockUserfront;
