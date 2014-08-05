/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect = require('chai').expect;
var Student = require('../../app/models/students');
var dbConnect = require('../../app/lib/mongodb');
var Mongo = require('mongodb');
var levon;

describe('Student', function(){
  before(function(done){
    dbConnect('grader-test', function(){
      done();
   });
 });
  beforeEach(function(done){
    Student.collection.remove(function(){
      levon = new Student({name:'levon smith', color:'blue'});
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Student item', function(){
      expect(levon).to.be.instanceof(Student);
      expect(levon.name).to.equal('levon smith');
      expect(levon.color).to.equal('blue');
      expect(levon.isSuspended).to.be.false;
      expect(levon.isHonorRoll).to.be.false;
      expect(levon.tests).to.be.empty;

    });
  });
  
  describe('#save', function(){
    it('should save a new student', function(done){
    levon.save(function(){
      expect(levon._id).to.be.instanceof(Mongo.ObjectID);
      done();
    });
   });
  });

  describe('.all', function(){
    it('should get all students in database', function(done){
      levon.save(function(){
       Student.all(function(students){
        expect(students).to.have.length(1);
        done();
       });
      });
    });
  });

  describe('.findById', function(){
    it('should find a student by id', function(done){
      levon.save(function(){ 
        Student.findById(levon._id.toString(), function(student){
         expect(student.name).to.equal('levon smith');
         done();
        });
      });
    });
  });

  describe('#addTest', function(){
    it('should add test scores', function(){
      levon.addTest('55');
      levon.addTest('65');
      levon.addTest('75');
      levon.addTest('85');
      levon.addTest('95');
        expect(levon.tests).to.have.length(5);
        expect(levon.tests[0].grade).to.equal(55);
        expect(levon.tests[0].color).to.equal('white');
        expect(levon.tests[0].letter).to.equal('F');
        expect(levon.tests[1].grade).to.equal(65);
        expect(levon.tests[1].color).to.equal('red');
        expect(levon.tests[1].letter).to.equal('D');
        expect(levon.tests[2].grade).to.equal(75);
        expect(levon.tests[2].color).to.equal('orange');
        expect(levon.tests[2].letter).to.equal('C');
        expect(levon.tests[3].grade).to.equal(85);
        expect(levon.tests[3].color).to.equal('green');
        expect(levon.tests[3].letter).to.equal('B');
        expect(levon.tests[4].grade).to.equal(95);
        expect(levon.tests[4].color).to.equal('blue');
        expect(levon.tests[4].letter).to.equal('A');

    });
    it('should suspend a student for more than 3 failing tests', function(){
        levon.addTest('12');
        levon.addTest('55');
        levon.addTest('60');
          expect(levon.isSuspended).to.be.true;
    });
  describe('#avg', function(){
      it('should find the average of the tests', function(){
        levon.addTest('100');
        levon.addTest('100');
        levon.addTest('100');
        levon.addTest('100');
        levon.addTest('100');
        var grade = levon.avg();
          expect(grade).to.equal(100);
      }); 
      it('should flag honor roll if test avg is above 95', function(){
        levon.addTest('98');
        levon.addTest('100');
        levon.addTest('100');
        levon.addTest('100');
        levon.addTest('95');
          expect(levon.isHonorRoll).to.be.true;
      });  
  });

  });
});
