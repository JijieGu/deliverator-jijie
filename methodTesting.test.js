const expect = require('expect');

const method = require('./method');

describe("Utilities (expectPowerAndMinMax)", () => {

    describe("#itemToArray", () => {
        //test for item to array method
        it('should return an element of string array', () => {
            var strArr = ['Helow','world']
            var result = method.itemsToArray(strArr);
            expect(result[1]).toBe('world');
            expect(typeof result[1]).toBe('string');
        })

        it('should return an element of number array', () => {
            var strArr = [1,2]
            var result = method.itemsToArray(strArr);
            expect(result[0]).toBe(1);
            expect(typeof result[0]).toBe('number');
        })

    })
    //test for KFC calculation
    describe("#calcPriceKFC", () => {

        it('should return KFC price of 0', () => {
        var strArr = ['Helow','world']
        var result = method.calcPriceKFC(strArr)
        expect(result).toBe(0);
        expect(typeof result).toBe('number');
        })

        it('should return KFC price of 2', () => {
            var strArr = ['Helow','thighs']
            var result = method.calcPriceKFC(strArr)
            expect(result).toBe(2);
            expect(typeof result).toBe('number');
        })

        it('should return KFC price of 3', () => {
            var strArr = ['wings','thighs']
            var result = method.calcPriceKFC(strArr)
            expect(result).toBe(3);
            expect(typeof result).toBe('number');
        })

    })
    //test for pizzahut calculation
    describe("#calcPricePizzaHut", () => {

        it('should return pizza hut price of 0', () => {
            var strArr = ['Helow','world']
            var result = method.calcPricePizzaHut(strArr)
            expect(result).toBe(0);
            expect(typeof result).toBe('number');
            })
    
        it('should return pizza hut price of 4', () => {
                var strArr = ['Helow','hawaii']
                var result = method.calcPricePizzaHut(strArr)
                expect(result).toBe(4);
                expect(typeof result).toBe('number');
            })
    
        it('should return pizza hut price of 7', () => {
                var strArr = ['fourCheese','hawaii']
                var result = method.calcPricePizzaHut(strArr)
                expect(result).toBe(7);
                expect(typeof result).toBe('number');
            })
    })
})