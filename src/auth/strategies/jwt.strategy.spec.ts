import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should map payload sub/email to userId/email', async () => {
      const payload = { sub: 'u1', email: 'alice@test.com' };
      const result = await strategy.validate(payload);
      expect(result).toEqual({ userId: 'u1', email: 'alice@test.com' });
    });
  });
});
