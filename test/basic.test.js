//var assert = require("assert"); 
//var express = require('express');
var request = require("supertest"); 

const app = require('../delivery').app;
// Load the expect library - common name for variable is "expect"
const expect = require('expect');

//GET tests
var url = "/registrationConsumer"; 
console.log(url); 
describe('Test GET Consumer Reg ', function(){
    it("Test", function(done){
        request(app)
            .get(url)
            .expect(200)
            .end(done);
    });
})

url = "/registrationMerchant"; 
console.log(url); 
describe('Test GET merchant Reg ', function(){
    it("Test", function(done){
        request(app)
            .get(url)
            .expect(200)
            .end(done);
    });
})

url = "/consumerMain"; 
console.log(url); 
describe('Test GET consumerMain not logged in ', function(){
    it("Test", function(done){
        request(app)
            .get(url)
            .expect(200)
            .end(done);
    });
})

url = "/merchantMain"; 
console.log(url); 
describe('Test GET merchantMain not logged in ', function(){
    it("Test", function(done){
        request(app)
            .get(url)
            .expect(200)
            .end(done);
    });
})


url = "/orderKFC"; 
console.log(url); 
describe('Test GET orderKFC not logged in', function(){
    it("Test", function(done){
        request(app)
            .get(url)
            .expect(200)
            .end(done);
    });
})

url = "/orderPizzaHut"; 
console.log(url); 
describe('Test GET orderPizzaHut not logged in', function(){
    it("Test", function(done){
        request(app)
            .get(url)
            .expect(200)
            .end(done);
    });
})

url = "/consumerLogin"; 
console.log(url); 
describe('Test GET consumerLogin ', function(){
    it("Test", function(done){
        request(app)
            .get(url)
            .expect(200)
            .end(done);
    });
})


url = "/merchantLogin"; 
console.log(url); 
describe('Test GET merchantLogin ', function(){
    it("Test", function(done){
        request(app)
            .get(url)
            .expect(200)
            .end(done);
    });
})

url = "/"; 
console.log(url); 
describe('Test GET index page ', function(){
    it("Test", function(done){
        request(app)
            .get(url)
            .expect(200)
            .end(done);
    });
})



//POST test



describe('Consumer log in with valid credential ', function(){
    it("Login Page", function(done){
        request(app)
            .post("/consumerMain")
            .send("username=mark&password=mark")
            .expect(200)
            .end(done);
    });
})


describe('Consumer log in with invalid credential ', function(){
    it("Login Page", function(done){
        request(app)
            .post("/consumerMain")
            .send("username=12&password=12")
            .expect(302)
            .expect((resp) => {
                expect(resp.text.indexOf("failed_login")).toBeGreaterThanOrEqual(0);
              })
            .end(done);
    });
})





