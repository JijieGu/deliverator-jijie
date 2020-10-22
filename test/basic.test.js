//var assert = require("assert"); 
//var express = require('express');
var request = require("supertest"); 

const app = require('../delivery').app;
// Load the expect library - common name for variable is "expect"
const expect = require('expect');
var url = "/registrationConsumer"; 
console.log(url); 
describe('Test 1 ', function(){
    it("Home Page Test", function(done){
        request(app)
            .get(url)
            .expect(200)
            .end(done);
    });
})



// only get method. Not post.
url = "/logout"; 


describe('Test 2 ', function(){
    it("logout Page Test", function(){
        request(url, function(err, res, body){
            console.log(err); 
            console.log(res);
            assert.strictEqual(res.statusCode, 200); 
        })
    });
})





url = "/consumerLogin"; 

describe('Test 3 ', function(){
    it("consumer login Page Test", function(){
        request(url, function(err, res, body){
            console.log(err); 
            console.log(res);
            assert.strictEqual(res.statusCode, 200); 
        })
    });
})

url = "/merchantLogin"; 

describe('Test 4 ', function(){
    it("merchant login Page Test", function(){
        request(url, function(err, res, body){
            console.log(err); 
            console.log(res);
            assert.strictEqual(res.statusCode, 200); 
        })
    });
})


url = "/registrationMerchant"; 

describe('Test 5 ', function(){
    it("merchant registration Page Test", function(){
        request(url, function(err, res, body){
            console.log(err); 
            console.log(res);
            assert.strictEqual(res.statusCode, 200); 
        })
    });
})

url = "/registrationConsumer"; 

describe('Test 6 ', function(){
    it("consumer registration Page Test", function(){
        request(url, function(err, res, body){
            console.log(err); 
            console.log(res);
            assert.strictEqual(res.statusCode, 200); 
        })
    });
})

url = "/consumerMain"; 

describe('Test 7 ', function(){
    it("consumer main Page Test", function(){
        request(url, function(err, res, body){
            console.log(err); 
            console.log(res);
            assert.strictEqual(res.statusCode, 200); 
        })
    });
})


url = "/merchantMain"; 

describe('Test 8 ', function(){
    it("merchant main Page Test", function(){
        request(url, function(err, res, body){
            console.log(err); 
            console.log(res);
            assert.strictEqual(res.statusCode, 200); 
        })
    });
})




describe('Test 9 ', function(){
    it("Login Page", function(done){
        request(app)
            .post("/consumerMain")
            .send("username=mark&password=mark")
            .expect(200)
            .end(done);
    });
})


url = "/orderKFC"; 

url = "/orderPizzaHut"; 



