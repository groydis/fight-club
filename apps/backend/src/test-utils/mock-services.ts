// test-utils/mock-services.ts
export const mockImageGenerator = {
  execute: jest.fn().mockResolvedValue({
    front: Buffer.from('mock front'),
    back: Buffer.from('mock back'),
    profile: Buffer.from('mock profile'),
  }),
};

export const mockFileStorage = {
  upload: jest.fn().mockResolvedValue('https://example.com/mock-image.png'),
};
