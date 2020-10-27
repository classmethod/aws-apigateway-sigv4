import { URL } from 'url';
import { Credentials } from 'aws-sdk';

// eslint-disable-next-line
const core = require('aws-sdk/lib/core');

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type AuthorizationHeader = {
    host: string;
    'X-Amz-Date'?: string;
    Authorization?: string;
};

type SignerV4Options = {
    url: string;
    headers: AuthorizationHeader;
    body?: string;
    pathname: () => string;
    methodIndex: string;
    search: () => string;
    region: string;
    method: string;
};

type CreateSigV4HeaderInput = {
    region: string;
    accessKey: string;
    secretAccessKey: string;
    sessionToken?: string;
    url: string;
    method: Method;
    body?: { [key: string]: string };
};

export function createSigV4Header(
    input: CreateSigV4HeaderInput
): AuthorizationHeader {
    const credential = new Credentials(
        input.accessKey,
        input.secretAccessKey,
        input.sessionToken
    );

    if (input.url === '') {
        throw new Error('url is empty');
    }
    if (input.region === '') {
        throw new Error('region is empty');
    }

    const url = new URL(input.url);
    const utcNow = new Date();
    const options: SignerV4Options = {
        url: url.toString(),
        headers: {
            host: url.host,
        },
        pathname: () => url.pathname,
        body:
            typeof input.body === 'object'
                ? JSON.stringify(input.body)
                : input.body,
        methodIndex: input.method.toLowerCase(),
        search: () => url.searchParams.toString() || '',
        region: input.region,
        method: input.method,
    };
    console.log(options);
    console.log(options.pathname());
    console.log(options.search());

    const signer = new core.Signers.V4(options, 'execute-api');
    signer.addAuthorization(credential, utcNow);

    return options.headers;
}
