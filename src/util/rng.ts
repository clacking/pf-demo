// biased unsecure RNG
export const RNG = (max = 100): number => {
    return Math.floor(Math.random() * 10000 % max);
}

export const randomString = (): string => {
    return btoa(Math.random().toString());
}

