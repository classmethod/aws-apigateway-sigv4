import { createSigV4Header, AuthorizationHeader } from './apigateway-sigv4';

let consoleSpy: jest.SpyInstance;
let dateNowSpy: jest.SpyInstance;

beforeAll(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const mockDate = new Date('2020-01-01T12:00:00Z');
    // FIXME: mockReturnValueがstring型しか受け付けない、対処方法がわからなかったのでanyで逃げています。
    dateNowSpy = jest.spyOn(global, 'Date').mockReturnValue(mockDate as any);
});

afterAll(() => {
    consoleSpy.mockRestore();
    dateNowSpy.mockRestore();
});

describe('Create sigv4 header', () => {
    test('🟢 create header', () => {
        const res = createSigV4Header({
            accessKey: '',
            secretAccessKey: '',
            region: 'ap-northeast-1',
            method: 'GET',
            url: 'https://example.com',
        });

        expect(res.host).toEqual('example.com');
        expect(res.Authorization).toEqual(
            expect.stringContaining(
                'AWS4-HMAC-SHA256 Credential=/20200101/ap-northeast-1/execute-api/aws4_request, SignedHeaders=host;x-amz-date, Signature='
            )
        );
        expect(res['X-Amz-Date']).toEqual('20200101T120000Z');
    });

    test('🔴 region is empty', () => {
        const func = (): AuthorizationHeader =>
            createSigV4Header({
                accessKey: '',
                secretAccessKey: '',
                region: '',
                method: 'GET',
                url: 'https://example.com',
            });

        expect(func).toThrowError(new Error('region is empty'));
    });

    test('🔴 url is empty', () => {
        const func = (): AuthorizationHeader =>
            createSigV4Header({
                accessKey: '',
                secretAccessKey: '',
                region: 'ap-northeast-1',
                method: 'GET',
                url: '',
            });
        expect(func).toThrowError(new Error('url is empty'));
    });
});
