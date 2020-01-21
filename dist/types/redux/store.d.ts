declare const configureStore: (preloadedState: any) => import("redux").Store<unknown, import("redux").Action<any>> & {
    dispatch: unknown;
};
export { configureStore };
