import { http, HttpResponse } from 'msw';


export const amenityDefaultHandler = http.get('https://overpass-api.de/api/interpreter', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('data');

    if (query?.includes('node["amenity"="cafe"]')) {
        return HttpResponse.json({
            elements: [
                {
                    id: 1,
                    lat: 51.51,
                    lon: -0.12,
                    tags: { name: 'Mock Café 1' },
                },
                {
                    id: 2,
                    lat: 51.52,
                    lon: -0.13,
                    tags: { name: 'Mock Café 2' },
                },
            ],
        });
    }

    return HttpResponse.json({ elements: [] });
})


export const amenityErrorHandler = http.get('https://overpass-api.de/api/interpreter', () => {
    return HttpResponse.text('Server Error', { status: 500 })
})

export const generateAmenityManyPinsHandler = (count: number) => http.get('https://overpass-api.de/api/interpreter', () => {
    const markers = Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        lat: 51.51 + i * 0.001,
        lon: -0.12 + i * 0.001,
        tags: {
            name: `Mock Café ${i + 1}`,
        },
    }));

    return HttpResponse.json({
        elements: markers,
    });
})
