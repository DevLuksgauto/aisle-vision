import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { CurrentUser } from './current-user.decorator';

function getDecoratorFactory(
  decorator: (...args: any[]) => ParameterDecorator,
) {
  class TestController {
    public test(_: unknown) {}
  }
  decorator()(TestController.prototype, 'test', 0);
  const metadata = Reflect.getMetadata(
    ROUTE_ARGS_METADATA,
    TestController,
    'test',
  );
  return metadata[Object.keys(metadata)[0]].factory;
}

describe('CurrentUser', () => {
  it('should extract user from the HTTP request context', () => {
    const factory = getDecoratorFactory(CurrentUser);
    const user = { userId: 'u1', email: 'luks@test.com' };
    const ctx = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user }),
      }),
    } as unknown as ExecutionContext;

    expect(factory(undefined, ctx)).toBe(user);
  });
});
