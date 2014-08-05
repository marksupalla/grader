'use strict';

var _ = require('lodash');
var Mongo = require('mongodb');

function Student(o){
  this.name = o.name;
  this.color = o.color;
  this.isSuspended = false;
  this.isHonorRoll = false;
  this.tests = [];
  this.failed = 0;


}

Object.defineProperty(Student, 'collection', {
  get: function(){return global.mongodb.collection('students');}
});

Student.prototype.save = function(cb){
  Student.collection.save(this, cb);
};

Student.all = function(cb){
  Student.collection.find().toArray(function(err, objects){
    var students = objects.map(function(o){
      return changePrototype(o);
    });
      cb(students);
  });
};
Student.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);

  Student.collection.findOne({_id:_id}, function(err, obj){
    var student = changePrototype(obj);
    cb(student);
  });
}; 

Student.prototype.addTest = function(grade){
  var color, letter;
  var test = parseInt(grade);

  if(test <= 60){
    letter = 'F';
    color = 'white';
    this.failed ++;
    if(this.failed === 3){
      this.isSuspended = true;}
  }else if(test > 60 && test <= 69){
    letter = 'D';
    color = 'red';
  }else if(test > 69 && test <= 79){
    letter = 'C';
    color = 'orange';
  }else if(test > 79 && test <= 89){
    letter = 'B';
    color = 'green';
  }else{
    letter = 'A';
    color = 'blue';
  }
  this.tests.push({grade:test, color:color, letter:letter});
  this.avg();

};
Student.prototype.avg = function(){
  var sum = 0;
  for(var i = 0; i < this.tests.length; i++){
    sum += this.tests[i].grade;
  }
    var gradeAvg= sum/this.tests.length;
      if(gradeAvg >= 95){ 
        this.isHonorRoll = true;
        this.color = 'green';
      }else if(gradeAvg 
    return testAvg;
};

module.exports = Student;

//private functions//

function changePrototype(obj){
  var student = _.create(Student.prototype, obj);
  return student;
}
