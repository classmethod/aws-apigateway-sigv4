import { createSigV4Header } from '../lib/apigateway-sigv4';
import axios from 'axios';

const accessKey = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;
const sessionToken = process.env.AWS_SESSION_TOKEN!;
const region = 'ap-northeast-1';
const url = process.env.API_GATEWAY_URL!;

(async () => {
    const res = await axios.get(url, {
        headers: createSigV4Header({
            accessKey,
            secretAccessKey,
            sessionToken,
            region,
            url,
            method: 'GET',
        }),
    });
    console.log(res);
})();
