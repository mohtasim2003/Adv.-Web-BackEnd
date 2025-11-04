const { CheckInDTO } = require('./checkin.dto');

describe('CheckInDTO', () => {
    it('should create an instance with valid properties', () => {
        const dto = new CheckInDTO();
        dto.property1 = 'value1';
        dto.property2 = 'value2';
        expect(dto.property1).toBe('value1');
        expect(dto.property2).toBe('value2');
    });

    it('should throw an error if required properties are missing', () => {
        expect(() => new CheckInDTO()).toThrow();
    });

    it('should validate property formats', () => {
        const dto = new CheckInDTO();
        dto.property1 = 'invalidValue';
        expect(dto.validate()).toBe(false);
    });
});