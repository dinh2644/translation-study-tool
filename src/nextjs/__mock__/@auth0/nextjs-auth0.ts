// Create this file at: __mocks__/@auth0/nextjs-auth0.ts

export const useUser = jest.fn(() => ({
    user: null,
    error: null,
    isLoading: false,
}));

export const withPageAuthRequired = jest.fn((component) => component);

export const getSession = jest.fn(() => Promise.resolve({ user: null }));

export const getAccessToken = jest.fn(() => Promise.resolve({ accessToken: null }));

export const withApiAuthRequired = jest.fn((handler) => handler);

export const handleAuth = jest.fn();
