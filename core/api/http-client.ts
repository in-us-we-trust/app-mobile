import axios, { AxiosHeaders } from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

let authToken: string | null = null;

export const httpClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export const setAuthToken = (token: string | null) => {
    authToken = token;
};

const toAbsoluteUrl = (url: string | undefined, baseURL: string | undefined) => {
    if (!url) {
        return baseURL ?? "";
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    if (!baseURL) {
        return url;
    }

    const normalizedBase = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
    const normalizedUrl = url.startsWith("/") ? url : `/${url}`;
    return `${normalizedBase}${normalizedUrl}`;
};

const stringifyBody = (data: unknown) => {
    if (typeof data === "string") {
        return data;
    }

    if (data === undefined || data === null) {
        return "";
    }

    try {
        return JSON.stringify(data);
    } catch {
        return "";
    }
};

const escapeSingleQuotes = (value: string) => value.replace(/'/g, `'"'"'`);

const buildCurlCommand = (config: any) => {
    const method = (config.method ?? "get").toUpperCase();
    const absoluteUrl = toAbsoluteUrl(config.url, config.baseURL);

    let urlWithParams = absoluteUrl;
    if (config.params && typeof config.params === "object") {
        const searchParams = new URLSearchParams();
        Object.entries(config.params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });

        const query = searchParams.toString();
        if (query) {
            const separator = absoluteUrl.includes("?") ? "&" : "?";
            urlWithParams = `${absoluteUrl}${separator}${query}`;
        }
    }

    const headers = AxiosHeaders.from(config.headers).toJSON();
    const headerChunks = Object.entries(headers)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `-H '${escapeSingleQuotes(`${key}: ${String(value)}`)}'`)
        .join(" ");

    const body = stringifyBody(config.data);
    const bodyChunk = body ? `--data '${escapeSingleQuotes(body)}'` : "";

    return `curl -X ${method} '${escapeSingleQuotes(urlWithParams)}' ${headerChunks} ${bodyChunk}`.trim();
};

httpClient.interceptors.request.use((config) => {
    if (!authToken) {
        const curl = buildCurlCommand(config);
        console.log(`[HTTP cURL] ${curl}`);
        return config;
    }

    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${authToken}`);
    config.headers = headers;

    const curl = buildCurlCommand(config);
    console.log(`[HTTP cURL] ${curl}`);

    return config;
});

httpClient.interceptors.response.use(
    (response) => {
        console.log(
            `[HTTP response] ${response.config.method?.toUpperCase()} ${response.config.url} → ${response.status}`,
            response.data,
        );
        return response;
    },
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url;
        const method = error.config?.method?.toUpperCase();
        console.log(
            `[HTTP error] ${method} ${url} → ${status ?? 'network error'}`,
            error.response?.data ?? error.message,
        );
        return Promise.reject(error);
    },
);
