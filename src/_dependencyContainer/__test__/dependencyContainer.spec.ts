import dependencyContainer from '../dependencyContainer';

describe('A dependency container', () => {
    beforeEach(() => {
        dependencyContainer.clear();
    });

    test('the dependency container provide a service', () => {
        dependencyContainer.set<NullService>('NullService', () => {
            return new NullService();
        });

        expect(dependencyContainer.get<NullService>('NullService')).toBeInstanceOf(NullService);
    });

    test('the dependency container throw an errors if the service is not initialized', () => {
        expect(() => dependencyContainer.get<NullService>('NullService')).toThrow(Error);
    });
});

class NullService {}
