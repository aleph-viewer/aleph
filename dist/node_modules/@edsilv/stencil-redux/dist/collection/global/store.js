export default () => {
    Context.store = (() => {
        let _store;
        const setStore = (store) => {
            _store = store;
        };
        const getState = () => {
            return _store && _store.getState();
        };
        const getStore = () => {
            return _store;
        };
        const mapDispatchToProps = (component, props) => {
            Object.keys(props).forEach(actionName => {
                const action = props[actionName];
                Object.defineProperty(component, actionName, {
                    get: () => (...args) => _store.dispatch(action(...args)),
                    configurable: true,
                    enumerable: true,
                });
            });
        };
        const mapStateToProps = (component, mapState) => {
            const _mapStateToProps = (_component, _mapState) => {
                const mergeProps = mapState(_store.getState());
                Object.keys(mergeProps).forEach(newPropName => {
                    const newPropValue = mergeProps[newPropName];
                    component[newPropName] = newPropValue;
                });
            };
            const unsubscribe = _store.subscribe(() => _mapStateToProps(component, mapState));
            _mapStateToProps(component, mapState);
            return unsubscribe;
        };
        return {
            getStore,
            setStore,
            getState,
            mapDispatchToProps,
            mapStateToProps,
        };
    })();
};
