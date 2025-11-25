export default defineNuxtPlugin((_nuxtApp) => {
    const config = useRuntimeConfig();

    const api = $fetch.create({
        baseURL: config.public.retailBaseAPI,
        async onRequest({ options }) {
            const defaultHeader = await useApiHeader();
            options.headers = {
                ...defaultHeader,
                ...options.headers,
            };
        },
    });

    const publicApi = $fetch.create({
        baseURL: config.public.retailBaseAPI,
    });

    return {
        provide: {
            api,
            publicApi,
        },
    };
});
